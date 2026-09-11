import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { SkillProof } from "../models/skillProof.model.js";

import {
    calculateJobMatch,
    uniqueSkills
} from "../utils/match.util.js";


/* =====================================================
   HELPERS
===================================================== */

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


const normalizeSkill = (skill) => {
    return String(skill || "")
        .trim()
        .toLowerCase();
};


/*
|--------------------------------------------------------------------------
| BUILD VERIFIED SKILL SET
|--------------------------------------------------------------------------
*/

const buildVerifiedSkillSet = (proofs = []) => {
    return new Set(
        proofs
            .filter(
                (proof) =>
                    proof.status === "approved"
            )
            .map(
                (proof) =>
                    normalizeSkill(
                        proof.skill
                    )
            )
            .filter(Boolean)
    );
};


/*
|--------------------------------------------------------------------------
| GET CANDIDATES FOR RECRUITER
|--------------------------------------------------------------------------
|
| Only candidates who have applied to at least one
| job owned by the authenticated recruiter are returned.
|
| Optional:
|
| ?jobId=<jobId>
|
| filters the result to one recruiter's job.
|
|--------------------------------------------------------------------------
*/

export const getRecruiterCandidates = async (
    req,
    res
) => {
    try {

        const {
            jobId
        } = req.query;


        /* =================================================
           1. GET RECRUITER JOBS
        ================================================= */

        const jobFilter = {
            recruiter:
                req.userId
        };


        if (jobId) {

            if (
                !isValidObjectId(jobId)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid job ID."
                });
            }


            jobFilter._id =
                jobId;
        }


        const recruiterJobs =
            await Job.find(
                jobFilter
            )
                .select(
                    "title skills location jobType status company"
                )
                .populate(
                    "company",
                    "name logo location"
                )
                .lean();


        /* =================================================
           2. NO JOBS
        ================================================= */

        if (
            recruiterJobs.length === 0
        ) {
            return res.status(200).json({
                success: true,

                candidates: [],

                summary: {
                    total: 0,
                    verifiedCandidates: 0,
                    strongMatches: 0,
                    averageMatchRate: 0
                }
            });
        }


        const recruiterJobIds =
            recruiterJobs.map(
                (job) =>
                    job._id
            );


        /* =================================================
           3. GET APPLICATIONS
        ================================================= */

        const applications =
            await Application.find({
                recruiter:
                    req.userId,

                job: {
                    $in:
                        recruiterJobIds
                }
            })
                .select(
                    "job candidate status intentResponse appliedAt recruiterRespondedAt lastStatusChangedAt"
                )
                .populate(
                    "candidate",
                    "fullname email phoneNumber profile"
                )
                .sort({
                    appliedAt: -1
                })
                .lean();


        /* =================================================
           4. NO APPLICANTS
        ================================================= */

        if (
            applications.length === 0
        ) {
            return res.status(200).json({
                success: true,

                candidates: [],

                summary: {
                    total: 0,
                    verifiedCandidates: 0,
                    strongMatches: 0,
                    averageMatchRate: 0
                }
            });
        }


        /* =================================================
           5. UNIQUE CANDIDATE IDS
        ================================================= */

        const candidateIds = [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.candidate?._id
                    )
                    .filter(Boolean)
                    .map(String)
            )
        ];


        /* =================================================
           6. GET ALL PROOFS
        ================================================= */

        const proofs =
            await SkillProof.find({
                candidate: {
                    $in:
                        candidateIds
                }
            })
                .select(
                    "candidate skill title proofType proofUrl status recruiterComment reviewedBy reviewedAt createdAt"
                )
                .populate(
                    "reviewedBy",
                    "fullname email"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


        /* =================================================
           7. GROUP PROOFS BY CANDIDATE
        ================================================= */

        const proofsByCandidate =
            new Map();


        for (
            const proof
            of proofs
        ) {

            const candidateKey =
                String(
                    proof.candidate
                );


            if (
                !proofsByCandidate.has(
                    candidateKey
                )
            ) {
                proofsByCandidate.set(
                    candidateKey,
                    []
                );
            }


            proofsByCandidate
                .get(candidateKey)
                .push(proof);
        }


        /* =================================================
           8. JOB MAP
        ================================================= */

        const jobMap =
            new Map(
                recruiterJobs.map(
                    (job) => [
                        String(job._id),
                        job
                    ]
                )
            );


        /* =================================================
           9. BUILD CANDIDATE MAP
        ================================================= */

        const candidateMap =
            new Map();


        for (
            const application
            of applications
        ) {

            const candidate =
                application.candidate;


            if (!candidate) {
                continue;
            }


            const candidateId =
                String(
                    candidate._id
                );


            if (
                !candidateMap.has(
                    candidateId
                )
            ) {

                const candidateProofs =
                    proofsByCandidate.get(
                        candidateId
                    ) || [];


                const verifiedProofs =
                    candidateProofs.filter(
                        (proof) =>
                            proof.status ===
                            "approved"
                    );


                const verifiedSkills =
                    uniqueSkills(
                        verifiedProofs.map(
                            (proof) =>
                                proof.skill
                        )
                    );


                const claimedSkills =
                    uniqueSkills(
                        candidate.profile?.skills ||
                        []
                    );


                const verifiedSkillSet =
                    buildVerifiedSkillSet(
                        candidateProofs
                    );


                const unverifiedClaimedSkills =
                    claimedSkills.filter(
                        (skill) =>
                            !verifiedSkillSet.has(
                                normalizeSkill(
                                    skill
                                )
                            )
                    );


                candidateMap.set(
                    candidateId,
                    {
                        candidateId,
                        fullname:
                            candidate.fullname,

                        email:
                            candidate.email,

                        phoneNumber:
                            candidate.phoneNumber,

                        profile: {
                            bio:
                                candidate.profile?.bio ||
                                "",

                            profilePhoto:
                                candidate.profile?.profilePhoto ||
                                "",

                            resume:
                                candidate.profile?.resume ||
                                "",

                            resumeOriginalName:
                                candidate.profile?.resumeOriginalName ||
                                ""
                        },

                        claimedSkills,

                        verifiedSkills,

                        unverifiedClaimedSkills,

                        proofs:
                            candidateProofs,

                        proofSummary: {
                            total:
                                candidateProofs.length,

                            pending:
                                candidateProofs.filter(
                                    (proof) =>
                                        proof.status ===
                                        "pending"
                                ).length,

                            approved:
                                candidateProofs.filter(
                                    (proof) =>
                                        proof.status ===
                                        "approved"
                                ).length,

                            rejected:
                                candidateProofs.filter(
                                    (proof) =>
                                        proof.status ===
                                        "rejected"
                                ).length
                        },

                        applications: [],

                        matchScores: []
                    }
                );
            }


            const candidateData =
                candidateMap.get(
                    candidateId
                );


            const job =
                jobMap.get(
                    String(
                        application.job
                    )
                );


            if (!job) {
                continue;
            }


            const candidateProofs =
                proofsByCandidate.get(
                    candidateId
                ) || [];


            const verifiedSkills =
                uniqueSkills(
                    candidateProofs
                        .filter(
                            (proof) =>
                                proof.status ===
                                "approved"
                        )
                        .map(
                            (proof) =>
                                proof.skill
                        )
                );


            const match =
                calculateJobMatch(
                    job.skills || [],
                    verifiedSkills
                );


            candidateData.applications.push({
                applicationId:
                    application._id,

                status:
                    application.status,

                intentResponse:
                    application.intentResponse,

                appliedAt:
                    application.appliedAt,

                recruiterRespondedAt:
                    application.recruiterRespondedAt,

                lastStatusChangedAt:
                    application.lastStatusChangedAt,

                job: {
                    id:
                        job._id,

                    title:
                        job.title,

                    location:
                        job.location,

                    jobType:
                        job.jobType,

                    status:
                        job.status,

                    company:
                        job.company
                            ? {
                                id:
                                    job.company._id,

                                name:
                                    job.company.name,

                                logo:
                                    job.company.logo ||
                                    ""
                            }
                            : null
                },

                match: {
                    score:
                        match.score,

                    strength:
                        match.strength,

                    matchedSkills:
                        match.matchedSkills,

                    missingSkills:
                        match.missingSkills,

                    verificationCoverage:
                        match.verificationCoverage
                }
            });


            candidateData.matchScores.push(
                match.score
            );
        }


        /* =================================================
           10. FINAL CANDIDATE METRICS
        ================================================= */

        const candidates =
            [...candidateMap.values()]
                .map(
                    (candidate) => {

                        const scores =
                            candidate.matchScores;


                        const averageMatchRate =
                            scores.length === 0
                                ? 0
                                : Math.round(
                                    scores.reduce(
                                        (
                                            total,
                                            score
                                        ) =>
                                            total +
                                            score,
                                        0
                                    ) /
                                    scores.length
                                );


                        const strongestMatch =
                            scores.length === 0
                                ? 0
                                : Math.max(
                                    ...scores
                                );


                        return {
                            ...candidate,

                            averageMatchRate,

                            strongestMatch,

                            isStrongMatch:
                                strongestMatch >=
                                80
                        };
                    }
                )
                .sort(
                    (a, b) =>
                        b.strongestMatch -
                        a.strongestMatch
                );


        /* =================================================
           11. SUMMARY
        ================================================= */

        const summary = {
            total:
                candidates.length,

            verifiedCandidates:
                candidates.filter(
                    (candidate) =>
                        candidate.verifiedSkills.length >
                        0
                ).length,

            strongMatches:
                candidates.filter(
                    (candidate) =>
                        candidate.isStrongMatch
                ).length,

            averageMatchRate:
                candidates.length === 0
                    ? 0
                    : Math.round(
                        candidates.reduce(
                            (
                                total,
                                candidate
                            ) =>
                                total +
                                candidate.averageMatchRate,
                            0
                        ) /
                        candidates.length
                    )
        };


        return res.status(200).json({
            success: true,

            candidates,

            summary
        });

    } catch (error) {

        console.error(
            "Get recruiter candidates error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch recruiter candidates."
        });
    }
};


/* =====================================================
   GET ONE CANDIDATE FOR RECRUITER
===================================================== */

export const getRecruiterCandidateById = async (
    req,
    res
) => {
    try {

        const {
            candidateId
        } = req.params;


        if (
            !isValidObjectId(
                candidateId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid candidate ID."
            });
        }


        /* =================================================
           1. FIND RECRUITER'S APPLICATIONS
        ================================================= */

        const applications =
            await Application.find({
                recruiter:
                    req.userId,

                candidate:
                    candidateId
            })
                .populate(
                    "job",
                    "title skills requirements location jobType status company"
                )
                .sort({
                    appliedAt: -1
                })
                .lean();


        if (
            applications.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate not found in your applicant pool."
            });
        }


        /* =================================================
           2. CANDIDATE
        ================================================= */

        const candidate =
            await User.findById(
                candidateId
            )
                .select(
                    "fullname email phoneNumber role profile createdAt"
                )
                .lean();


        if (!candidate) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate account not found."
            });
        }


        if (
            candidate.role !==
            "candidate"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Selected account is not a candidate."
            });
        }


        /* =================================================
           3. ALL PROOFS
        ================================================= */

        const proofs =
            await SkillProof.find({
                candidate:
                    candidateId
            })
                .populate(
                    "reviewedBy",
                    "fullname email"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


        const approvedSkills =
            uniqueSkills(
                proofs
                    .filter(
                        (proof) =>
                            proof.status ===
                            "approved"
                    )
                    .map(
                        (proof) =>
                            proof.skill
                    )
            );


        const claimedSkills =
            uniqueSkills(
                candidate.profile?.skills ||
                []
            );


        const verifiedSkillSet =
            buildVerifiedSkillSet(
                proofs
            );


        const unverifiedClaimedSkills =
            claimedSkills.filter(
                (skill) =>
                    !verifiedSkillSet.has(
                        normalizeSkill(
                            skill
                        )
                    )
            );


        /* =================================================
           4. APPLICATION INTELLIGENCE
        ================================================= */

        const enrichedApplications =
            applications.map(
                (application) => {

                    const job =
                        application.job;


                    const requiredSkills =
                        uniqueSkills(
                            job?.skills || []
                        );


                    const match =
                        calculateJobMatch(
                            requiredSkills,
                            approvedSkills
                        );


                    return {
                        ...application,

                        match: {
                            score:
                                match.score,

                            strength:
                                match.strength,

                            matchedSkills:
                                match.matchedSkills,

                            missingSkills:
                                match.missingSkills,

                            verificationCoverage:
                                match.verificationCoverage
                        }
                    };
                }
            );


        const scores =
            enrichedApplications.map(
                (application) =>
                    application.match.score
            );


        const averageMatchRate =
            scores.length === 0
                ? 0
                : Math.round(
                    scores.reduce(
                        (
                            total,
                            score
                        ) =>
                            total + score,
                        0
                    ) /
                    scores.length
                );


        /* =================================================
           5. RESPONSE
        ================================================= */

        return res.status(200).json({
            success: true,

            candidate: {
                id:
                    candidate._id,

                fullname:
                    candidate.fullname,

                email:
                    candidate.email,

                phoneNumber:
                    candidate.phoneNumber,

                profile:
                    candidate.profile,

                createdAt:
                    candidate.createdAt,

                claimedSkills,

                verifiedSkills:
                    approvedSkills,

                unverifiedClaimedSkills,

                proofs,

                proofSummary: {
                    total:
                        proofs.length,

                    pending:
                        proofs.filter(
                            (proof) =>
                                proof.status ===
                                "pending"
                        ).length,

                    approved:
                        proofs.filter(
                            (proof) =>
                                proof.status ===
                                "approved"
                        ).length,

                    rejected:
                        proofs.filter(
                            (proof) =>
                                proof.status ===
                                "rejected"
                        ).length
                },

                applications:
                    enrichedApplications,

                averageMatchRate,

                strongestMatch:
                    scores.length === 0
                        ? 0
                        : Math.max(
                            ...scores
                        )
            }
        });

    } catch (error) {

        console.error(
            "Get recruiter candidate error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch candidate intelligence."
        });
    }
};
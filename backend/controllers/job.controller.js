import mongoose from "mongoose";

import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
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


const normalizeText = (value) => {
    return String(value || "").trim();
};


const normalizeList = (value) => {
    if (Array.isArray(value)) {
        return uniqueSkills(value);
    }

    if (typeof value === "string") {
        return uniqueSkills(
            value
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean)
        );
    }

    return [];
};


const parseNullableNumber = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
};


const getApplicationStatusCounts = (
    applications = []
) => {
    return {
        total: applications.length,

        applied: applications.filter(
            (item) => item.status === "applied"
        ).length,

        reviewing: applications.filter(
            (item) => item.status === "reviewing"
        ).length,

        shortlisted: applications.filter(
            (item) => item.status === "shortlisted"
        ).length,

        interview: applications.filter(
            (item) => item.status === "interview"
        ).length,

        rejected: applications.filter(
            (item) => item.status === "rejected"
        ).length,

        hired: applications.filter(
            (item) => item.status === "hired"
        ).length
    };
};


/* =====================================================
   CREATE JOB
===================================================== */

export const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            skills,
            location,
            jobType,
            salaryMin,
            salaryMax,
            companyId,
            status
        } = req.body;


        const normalizedTitle =
            normalizeText(title);

        const normalizedDescription =
            normalizeText(description);

        const normalizedLocation =
            normalizeText(location);


        const allowedJobTypes = [
            "full-time",
            "part-time",
            "internship",
            "contract"
        ];


        const allowedStatuses = [
            "draft",
            "active"
        ];


        /* ==================== VALIDATION ==================== */

        if (!normalizedTitle) {
            return res.status(400).json({
                success: false,
                message:
                    "Job title is required."
            });
        }


        if (!normalizedDescription) {
            return res.status(400).json({
                success: false,
                message:
                    "Job description is required."
            });
        }


        if (!normalizedLocation) {
            return res.status(400).json({
                success: false,
                message:
                    "Job location is required."
            });
        }


        if (!allowedJobTypes.includes(jobType)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job type."
            });
        }


        if (!companyId) {
            return res.status(400).json({
                success: false,
                message:
                    "Company is required."
            });
        }


        if (!isValidObjectId(companyId)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid company ID."
            });
        }


        /* ==================== SALARY ==================== */

        const normalizedSalaryMin =
            parseNullableNumber(salaryMin);

        const normalizedSalaryMax =
            parseNullableNumber(salaryMax);


        if (
            normalizedSalaryMin !== null &&
            normalizedSalaryMax !== null &&
            normalizedSalaryMin >
            normalizedSalaryMax
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Minimum salary cannot be greater than maximum salary."
            });
        }


        /* ==================== COMPANY OWNERSHIP ==================== */

        const company =
            await Company.findOne({
                _id: companyId,
                owner: req.userId
            });


        if (!company) {
            return res.status(404).json({
                success: false,
                message:
                    "Company not found or you do not own it."
            });
        }


        /* ==================== ARRAYS ==================== */

        const normalizedRequirements =
            normalizeList(requirements);

        const normalizedSkills =
            normalizeList(skills);


        /* ==================== STATUS ==================== */

        const normalizedStatus =
            allowedStatuses.includes(status)
                ? status
                : "active";


        /* ==================== CREATE ==================== */

        const job =
            await Job.create({
                title:
                    normalizedTitle,

                description:
                    normalizedDescription,

                requirements:
                    normalizedRequirements,

                skills:
                    normalizedSkills,

                location:
                    normalizedLocation,

                jobType,

                salaryMin:
                    normalizedSalaryMin,

                salaryMax:
                    normalizedSalaryMax,

                company:
                    company._id,

                recruiter:
                    req.userId,

                status:
                    normalizedStatus,

                lastRecruiterActivity:
                    new Date()
            });


        const populatedJob =
            await Job.findById(job._id)
                .populate(
                    "company",
                    "name description website location logo"
                )
                .populate(
                    "recruiter",
                    "fullname email"
                );


        return res.status(201).json({
            success: true,

            message:
                normalizedStatus === "draft"
                    ? "Job saved as draft."
                    : "Job posted successfully.",

            job:
                populatedJob
        });

    } catch (error) {

        console.error(
            "Create job error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create job."
        });
    }
};


/* =====================================================
   GET ALL ACTIVE JOBS
===================================================== */

export const getAllJobs = async (req, res) => {
    try {

        const {
            keyword,
            location,
            jobType
        } = req.query;


        const query = {
            status: "active"
        };


        /* ==================== KEYWORD ==================== */

        if (
            typeof keyword === "string" &&
            keyword.trim()
        ) {

            const regex =
                new RegExp(
                    keyword.trim(),
                    "i"
                );


            query.$or = [
                {
                    title: regex
                },

                {
                    description: regex
                },

                {
                    skills: regex
                },

                {
                    requirements: regex
                }
            ];
        }


        /* ==================== LOCATION ==================== */

        if (
            typeof location === "string" &&
            location.trim()
        ) {

            query.location =
                new RegExp(
                    location.trim(),
                    "i"
                );
        }


        /* ==================== JOB TYPE ==================== */

        if (
            typeof jobType === "string" &&
            jobType.trim()
        ) {

            const allowedJobTypes = [
                "full-time",
                "part-time",
                "internship",
                "contract"
            ];


            if (
                !allowedJobTypes.includes(
                    jobType
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid job type."
                });
            }


            query.jobType =
                jobType;
        }


        /* ==================== QUERY ==================== */

        const jobs =
            await Job.find(query)
                .populate(
                    "company",
                    "name logo location description website"
                )
                .populate(
                    "recruiter",
                    "fullname"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


        return res.status(200).json({
            success: true,

            count:
                jobs.length,

            jobs
        });

    } catch (error) {

        console.error(
            "Get all jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch available jobs."
        });
    }
};


/* =====================================================
   GET RECRUITER'S JOBS
===================================================== */

export const getMyJobs = async (req, res) => {
    try {

        const jobs =
            await Job.find({
                recruiter:
                    req.userId
            })
                .populate(
                    "company",
                    "name logo location"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


        if (jobs.length === 0) {
            return res.status(200).json({
                success: true,

                jobs: [],

                summary: {
                    total: 0,
                    active: 0,
                    drafts: 0,
                    paused: 0,
                    closed: 0,

                    applicants: 0,

                    applied: 0,
                    reviewing: 0,
                    shortlisted: 0,
                    interview: 0,
                    rejected: 0,
                    hired: 0,

                    verifiedApplicants: 0,
                    strongMatches: 0,
                    averageMatchRate: 0
                }
            });
        }


        /* =================================================
           GET APPLICATIONS
        ================================================= */

        const jobIds =
            jobs.map(
                (job) => job._id
            );


        const applications =
            await Application.find({
                job: {
                    $in: jobIds
                }
            })
                .select(
                    "job candidate status"
                )
                .lean();


        /* =================================================
           GET APPROVED SKILL PROOFS
        ================================================= */

        const candidateIds = [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.candidate
                    )
                    .filter(Boolean)
                    .map(String)
            )
        ];


        let approvedProofs = [];


        if (
            candidateIds.length > 0
        ) {

            approvedProofs =
                await SkillProof.find({
                    candidate: {
                        $in:
                            candidateIds
                    },

                    status:
                        "approved"
                })
                    .select(
                        "candidate skill"
                    )
                    .lean();
        }


        /* =================================================
           CANDIDATE VERIFIED SKILL MAP
        ================================================= */

        const candidateSkillMap =
            new Map();


        for (
            const proof
            of approvedProofs
        ) {

            const candidateId =
                String(
                    proof.candidate
                );


            if (
                !candidateSkillMap.has(
                    candidateId
                )
            ) {
                candidateSkillMap.set(
                    candidateId,
                    []
                );
            }


            candidateSkillMap
                .get(candidateId)
                .push(
                    proof.skill
                );
        }


        /* =================================================
           JOB MAP
        ================================================= */

        const jobMap =
            new Map(
                jobs.map(
                    (job) => [
                        String(
                            job._id
                        ),
                        job
                    ]
                )
            );


        /* =================================================
           STATS MAP
        ================================================= */

        const statsMap =
            new Map();


        for (
            const job
            of jobs
        ) {

            statsMap.set(
                String(job._id),
                {
                    applicants: 0,

                    applied: 0,
                    reviewing: 0,
                    shortlisted: 0,
                    interview: 0,
                    rejected: 0,
                    hired: 0,

                    verifiedApplicants: 0,
                    strongMatches: 0,

                    totalMatchScore: 0,
                    scoredApplications: 0
                }
            );
        }


        /* =================================================
           PROCESS APPLICATIONS
        ================================================= */

        for (
            const application
            of applications
        ) {

            const jobId =
                String(
                    application.job
                );


            const job =
                jobMap.get(
                    jobId
                );


            const stats =
                statsMap.get(
                    jobId
                );


            if (
                !job ||
                !stats
            ) {
                continue;
            }


            stats.applicants += 1;


            if (
                application.status ===
                "applied"
            ) {
                stats.applied += 1;
            }


            if (
                application.status ===
                "reviewing"
            ) {
                stats.reviewing += 1;
            }


            if (
                application.status ===
                "shortlisted"
            ) {
                stats.shortlisted += 1;
            }


            if (
                application.status ===
                "interview"
            ) {
                stats.interview += 1;
            }


            if (
                application.status ===
                "rejected"
            ) {
                stats.rejected += 1;
            }


            if (
                application.status ===
                "hired"
            ) {
                stats.hired += 1;
            }


            /* ==================== MATCH ==================== */

            const candidateSkills =
                candidateSkillMap.get(
                    String(
                        application.candidate
                    )
                ) || [];


            if (
                candidateSkills.length > 0
            ) {

                stats.verifiedApplicants += 1;
            }


            const requiredSkills =
                uniqueSkills([
                    ...(job.skills || []),

                    ...(job.requirements || [])
                ]);


            if (
                requiredSkills.length > 0
            ) {

                const match =
                    calculateJobMatch(
                        requiredSkills,
                        candidateSkills
                    );


                stats.totalMatchScore +=
                    match.score;

                stats.scoredApplications +=
                    1;


                if (
                    match.score >= 80
                ) {
                    stats.strongMatches +=
                        1;
                }
            }
        }


        /* =================================================
           ENRICH JOBS
        ================================================= */

        const enrichedJobs =
            jobs.map(
                (job) => {

                    const stats =
                        statsMap.get(
                            String(job._id)
                        );


                    const averageMatchRate =
                        stats.scoredApplications === 0
                            ? 0
                            : Math.round(
                                stats.totalMatchScore /
                                stats.scoredApplications
                            );


                    return {
                        ...job,

                        applicantCount:
                            stats.applicants,

                        appliedApplications:
                            stats.applied,

                        reviewingApplications:
                            stats.reviewing,

                        shortlistedApplications:
                            stats.shortlisted,

                        interviewApplications:
                            stats.interview,

                        rejectedApplications:
                            stats.rejected,

                        hiredApplications:
                            stats.hired,

                        verifiedApplicantCount:
                            stats.verifiedApplicants,

                        strongMatchCount:
                            stats.strongMatches,

                        matchRate:
                            averageMatchRate
                    };
                }
            );


        /* =================================================
           SUMMARY
        ================================================= */

        const summary = {
            total:
                enrichedJobs.length,

            active:
                enrichedJobs.filter(
                    (job) =>
                        job.status === "active"
                ).length,

            drafts:
                enrichedJobs.filter(
                    (job) =>
                        job.status === "draft"
                ).length,

            paused:
                enrichedJobs.filter(
                    (job) =>
                        job.status === "paused"
                ).length,

            closed:
                enrichedJobs.filter(
                    (job) =>
                        job.status === "closed"
                ).length,

            applicants:
                applications.length,

            applied:
                applications.filter(
                    (application) =>
                        application.status ===
                        "applied"
                ).length,

            reviewing:
                applications.filter(
                    (application) =>
                        application.status ===
                        "reviewing"
                ).length,

            shortlisted:
                applications.filter(
                    (application) =>
                        application.status ===
                        "shortlisted"
                ).length,

            interview:
                applications.filter(
                    (application) =>
                        application.status ===
                        "interview"
                ).length,

            rejected:
                applications.filter(
                    (application) =>
                        application.status ===
                        "rejected"
                ).length,

            hired:
                applications.filter(
                    (application) =>
                        application.status ===
                        "hired"
                ).length,

            verifiedApplicants:
                enrichedJobs.reduce(
                    (
                        total,
                        job
                    ) =>
                        total +
                        job.verifiedApplicantCount,
                    0
                ),

            strongMatches:
                enrichedJobs.reduce(
                    (
                        total,
                        job
                    ) =>
                        total +
                        job.strongMatchCount,
                    0
                ),

            averageMatchRate:
                enrichedJobs.length === 0
                    ? 0
                    : Math.round(
                        enrichedJobs.reduce(
                            (
                                total,
                                job
                            ) =>
                                total +
                                job.matchRate,
                            0
                        ) /
                        enrichedJobs.length
                    )
        };


        return res.status(200).json({
            success: true,

            jobs:
                enrichedJobs,

            summary
        });

    } catch (error) {

        console.error(
            "Get my jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch your jobs."
        });
    }
};


/* =====================================================
   GET SINGLE JOB
   Candidate
===================================================== */

export const getJobById = async (req, res) => {
    try {

        const {
            id
        } = req.params;


        if (
            !isValidObjectId(id)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID."
            });
        }


        const job =
            await Job.findById(id)
                .populate(
                    "company",
                    "name description website location logo"
                )
                .populate(
                    "recruiter",
                    "fullname"
                )
                .lean();


        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found."
            });
        }


        if (
            job.status !== "active"
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "This job is no longer accepting applications."
            });
        }


        /* ==================== EXISTING APPLICATION ==================== */

        const existingApplication =
            await Application.findOne({
                job: job._id,
                candidate: req.userId
            })
                .select(
                    "status appliedAt lastStatusChangedAt"
                )
                .lean();


        /* ==================== CANDIDATE PROOF ==================== */

        const approvedProofs =
            await SkillProof.find({
                candidate: req.userId,
                status: "approved"
            })
                .select("skill")
                .lean();


        const approvedSkills =
            uniqueSkills(
                approvedProofs.map(
                    (proof) => proof.skill
                )
            );


        /* ==================== MATCH ==================== */

        const requiredSkills =
            uniqueSkills([
                ...(job.skills || []),

                ...(job.requirements || [])
            ]);


        const match =
            calculateJobMatch(
                requiredSkills,
                approvedSkills
            );


        const applicantCount =
            await Application.countDocuments({
                job: job._id
            });


        return res.status(200).json({
            success: true,

            job: {
                ...job,

                applicantCount,

                application:
                    existingApplication,

                match: {
                    score:
                        match.score,

                    matchedSkills:
                        match.matchedSkills,

                    missingSkills:
                        match.missingSkills,

                    verificationCoverage:
                        match.verificationCoverage,

                    strength:
                        match.strength
                }
            }
        });

    } catch (error) {

        console.error(
            "Get job by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch this job."
        });
    }
};


/* =====================================================
   UPDATE JOB
===================================================== */

export const updateJob = async (req, res) => {
    try {

        const {
            jobId
        } = req.params;


        if (
            !isValidObjectId(jobId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID."
            });
        }


        const job =
            await Job.findOne({
                _id: jobId,
                recruiter: req.userId
            });


        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or you do not own this job."
            });
        }


        if (
            job.status === "closed"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Closed jobs cannot be edited."
            });
        }


        const {
            title,
            description,
            requirements,
            skills,
            location,
            jobType,
            salaryMin,
            salaryMax
        } = req.body;


        if (
            title !== undefined
        ) {

            const value =
                normalizeText(title);


            if (!value) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Job title cannot be empty."
                });
            }


            job.title =
                value;
        }


        if (
            description !== undefined
        ) {

            const value =
                normalizeText(
                    description
                );


            if (!value) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Job description cannot be empty."
                });
            }


            job.description =
                value;
        }


        if (
            requirements !== undefined
        ) {
            job.requirements =
                normalizeList(
                    requirements
                );
        }


        if (
            skills !== undefined
        ) {
            job.skills =
                normalizeList(
                    skills
                );
        }


        if (
            location !== undefined
        ) {

            const value =
                normalizeText(
                    location
                );


            if (!value) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Location cannot be empty."
                });
            }


            job.location =
                value;
        }


        if (
            jobType !== undefined
        ) {

            const allowedJobTypes = [
                "full-time",
                "part-time",
                "internship",
                "contract"
            ];


            if (
                !allowedJobTypes.includes(
                    jobType
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid job type."
                });
            }


            job.jobType =
                jobType;
        }


        if (
            salaryMin !== undefined
        ) {
            job.salaryMin =
                parseNullableNumber(
                    salaryMin
                );
        }


        if (
            salaryMax !== undefined
        ) {
            job.salaryMax =
                parseNullableNumber(
                    salaryMax
                );
        }


        if (
            job.salaryMin !== null &&
            job.salaryMax !== null &&
            job.salaryMin >
            job.salaryMax
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Minimum salary cannot be greater than maximum salary."
            });
        }


        job.lastRecruiterActivity =
            new Date();


        await job.save();


        const updatedJob =
            await Job.findById(
                job._id
            )
                .populate(
                    "company",
                    "name logo location"
                );


        return res.status(200).json({
            success: true,

            message:
                "Job updated successfully.",

            job:
                updatedJob
        });

    } catch (error) {

        console.error(
            "Update job error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update this job."
        });
    }
};


/* =====================================================
   UPDATE JOB STATUS
===================================================== */

export const updateJobStatus = async (
    req,
    res
) => {
    try {

        const {
            jobId
        } = req.params;


        const {
            status
        } = req.body;


        if (
            !isValidObjectId(jobId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID."
            });
        }


        const allowedStatuses = [
            "active",
            "paused",
            "closed"
        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be active, paused, or closed."
            });
        }


        const job =
            await Job.findOne({
                _id: jobId,
                recruiter: req.userId
            });


        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or you do not own this job."
            });
        }


        if (
            job.status === "closed" &&
            status !== "closed"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Closed jobs cannot be reopened."
            });
        }


        job.status =
            status;

        job.lastRecruiterActivity =
            new Date();


        await job.save();


        return res.status(200).json({
            success: true,

            message:
                `Job status changed to ${status}.`,

            job
        });

    } catch (error) {

        console.error(
            "Update job status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update job status."
        });
    }
};
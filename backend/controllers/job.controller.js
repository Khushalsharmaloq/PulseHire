import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import mongoose from "mongoose";


/*
|--------------------------------------------------------------------------
| CREATE JOB
|--------------------------------------------------------------------------
*/

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


        /* ==================== VALIDATION ==================== */

        if (
            !title ||
            !description ||
            !location ||
            !jobType ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Required job fields are missing.",
                success: false
            });
        }


        /* ==================== CHECK COMPANY ==================== */

        const company = await Company.findOne({
            _id: companyId,
            owner: req.userId
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found or you do not own it.",
                success: false
            });
        }


        /* ==================== NORMALIZE ARRAYS ==================== */

        const normalizedRequirements = Array.isArray(requirements)
            ? requirements
                .map((item) => String(item).trim())
                .filter(Boolean)
            : [];

        const normalizedSkills = Array.isArray(skills)
            ? [
                ...new Set(
                    skills
                        .map((skill) => String(skill).trim())
                        .filter(Boolean)
                )
            ]
            : [];


        /* ==================== VALIDATE STATUS ==================== */

        const allowedStatuses = [
            "draft",
            "active",
            "paused",
            "closed"
        ];

        const normalizedStatus = allowedStatuses.includes(status)
            ? status
            : "active";


        /* ==================== CREATE JOB ==================== */

        const job = await Job.create({
            title: String(title).trim(),
            description: String(description).trim(),

            requirements: normalizedRequirements,

            skills: normalizedSkills,

            location: String(location).trim(),

            jobType,

            salaryMin:
                salaryMin === "" || salaryMin === undefined
                    ? null
                    : Number(salaryMin),

            salaryMax:
                salaryMax === "" || salaryMax === undefined
                    ? null
                    : Number(salaryMax),

            company: company._id,

            recruiter: req.userId,

            status: normalizedStatus,

            lastRecruiterActivity: new Date()
        });


        const populatedJob = await Job.findById(job._id)
            .populate(
                "company",
                "name logo location"
            )
            .populate(
                "recruiter",
                "fullname email"
            );


        return res.status(201).json({
            message:
                normalizedStatus === "draft"
                    ? "Job saved as draft."
                    : "Job posted successfully.",
            success: true,
            job: populatedJob
        });

    } catch (error) {
        console.error(
            "Create job error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/*
|--------------------------------------------------------------------------
| GET ALL ACTIVE JOBS
|--------------------------------------------------------------------------
*/

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: "active"
        })
            .populate(
                "company",
                "name logo location"
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
            jobs
        });

    } catch (error) {
        console.error(
            "Get jobs error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/*
|--------------------------------------------------------------------------
| GET RECRUITER'S JOBS
|--------------------------------------------------------------------------
*/

export const getMyJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            recruiter: req.userId
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
                    verifiedApplicants: 0
                }
            });
        }


        /* =====================================================
           APPLICATION COUNTS
           ===================================================== */

        const jobIds = jobs.map(
            (job) => job._id
        );


        const applications = await Application.find({
            job: {
                $in: jobIds
            }
        })
            .select(
                "job applicant status"
            )
            .lean();


        const applicationStats = new Map();


        for (const application of applications) {

            const jobId =
                String(application.job);


            if (!applicationStats.has(jobId)) {
                applicationStats.set(
                    jobId,
                    {
                        applicants: 0,
                        accepted: 0,
                        rejected: 0,
                        pending: 0,
                        applicantsSet: new Set()
                    }
                );
            }


            const stats =
                applicationStats.get(jobId);


            stats.applicants += 1;


            if (application.status === "accepted") {
                stats.accepted += 1;
            }


            if (application.status === "rejected") {
                stats.rejected += 1;
            }


            if (application.status === "pending") {
                stats.pending += 1;
            }


            if (application.applicant) {
                stats.applicantsSet.add(
                    String(application.applicant)
                );
            }
        }


        /* =====================================================
           BUILD JOB RESPONSE
           ===================================================== */

        const enrichedJobs = jobs.map(
            (job) => {

                const stats =
                    applicationStats.get(
                        String(job._id)
                    ) || {
                        applicants: 0,
                        accepted: 0,
                        rejected: 0,
                        pending: 0,
                        applicantsSet: new Set()
                    };


                return {
                    ...job,

                    applicantCount:
                        stats.applicants,

                    acceptedApplications:
                        stats.accepted,

                    rejectedApplications:
                        stats.rejected,

                    pendingApplications:
                        stats.pending,

                    verifiedApplicantCount: 0,

                    /*
                     * Match intelligence will be connected
                     * after the candidate/job matching layer
                     * is completed.
                     */
                    strongMatchCount: 0,

                    matchRate: 0
                };
            }
        );


        /* =====================================================
           SUMMARY
           ===================================================== */

        const summary = {
            total: enrichedJobs.length,

            active: enrichedJobs.filter(
                (job) => job.status === "active"
            ).length,

            drafts: enrichedJobs.filter(
                (job) => job.status === "draft"
            ).length,

            paused: enrichedJobs.filter(
                (job) => job.status === "paused"
            ).length,

            closed: enrichedJobs.filter(
                (job) => job.status === "closed"
            ).length,

            applicants:
                applications.length,

            verifiedApplicants: 0
        };


        return res.status(200).json({
            success: true,
            jobs: enrichedJobs,
            summary
        });

    } catch (error) {
        console.error(
            "Get my jobs error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE JOB
|--------------------------------------------------------------------------
*/

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false
            });
        }

        const job = await Job.findById(id)
            .populate(
                "company",
                "name description website location logo"
            )
            .populate(
                "recruiter",
                "fullname email"
            )
            .lean();

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (job.status !== "active") {
            return res.status(404).json({
                message: "This job is no longer active.",
                success: false
            });
        }

        const applicantCount = await Application.countDocuments({
            job: job._id
        });

        return res.status(200).json({
            success: true,
            job: {
                ...job,
                applicantCount
            }
        });

    } catch (error) {
        console.error(
            "Get job by ID error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
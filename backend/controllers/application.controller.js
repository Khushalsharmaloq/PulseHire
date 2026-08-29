import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

import { getJobFreshness } from "../utils/freshness.util.js";
import { calculateResponseDebt } from "../utils/responseDebt.util.js";


/* =====================================================
   APPLY TO JOB
===================================================== */

export const applyToJob = async (req, res) => {
    try {
        const {
            jobId,
            intentResponse
        } = req.body;


        if (!jobId || !intentResponse) {
            return res.status(400).json({
                message: "Job ID and intent response are required.",
                success: false
            });
        }


        if (intentResponse.trim().length < 20) {
            return res.status(400).json({
                message: "Intent response must be at least 20 characters.",
                success: false
            });
        }


        if (intentResponse.trim().length > 1000) {
            return res.status(400).json({
                message: "Intent response cannot exceed 1000 characters.",
                success: false
            });
        }


        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }


        if (job.status !== "active") {
            return res.status(400).json({
                message: "This job is no longer accepting applications.",
                success: false
            });
        }


        const existingApplication = await Application.findOne({
            job: jobId,
            candidate: req.userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied to this job.",
                success: false
            });
        }


        const application = await Application.create({
            job: job._id,
            candidate: req.userId,
            recruiter: job.recruiter,
            intentResponse: intentResponse.trim(),
            status: "applied",
            appliedAt: new Date(),
            lastStatusChangedAt: new Date()
        });


        return res.status(201).json({
            message: "Application submitted successfully.",
            success: true,
            application
        });

    } catch (error) {
        console.error("Apply to job error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   GET MY APPLICATIONS
===================================================== */

export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            candidate: req.userId
        })
            .populate(
                "job",
                "title location jobType status lastRecruiterActivity"
            )
            .populate(
                "recruiter",
                "fullname email"
            )
            .sort({
                appliedAt: -1
            });


        const applicationsWithMetrics = applications.map(
            (application) => {

                const responseDebt =
                    application.recruiterRespondedAt
                        ? null
                        : calculateResponseDebt(
                            application.appliedAt
                        );


                const jobFreshness =
                    application.job
                        ? getJobFreshness(
                            application.job.lastRecruiterActivity
                        )
                        : null;


                return {
                    ...application.toObject(),
                    responseDebt,
                    jobFreshness
                };
            }
        );


        return res.status(200).json({
            success: true,
            applications: applicationsWithMetrics
        });

    } catch (error) {
        console.error(
            "Get my applications error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   GET JOB APPLICATIONS FOR RECRUITER
===================================================== */

export const getJobApplications = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;


        const job = await Job.findOne({
            _id: jobId,
            recruiter: req.userId
        });


        if (!job) {
            return res.status(404).json({
                message: "Job not found or you do not own this job.",
                success: false
            });
        }


        const applications = await Application.find({
            job: jobId
        })
            .populate(
                "candidate",
                "fullname email phoneNumber profile"
            )
            .sort({
                appliedAt: -1
            });


        const applicationsWithMetrics = applications.map(
            (application) => {

                const responseDebt =
                    application.recruiterRespondedAt
                        ? null
                        : calculateResponseDebt(
                            application.appliedAt
                        );


                return {
                    ...application.toObject(),
                    responseDebt
                };
            }
        );


        return res.status(200).json({
            success: true,
            applications: applicationsWithMetrics
        });

    } catch (error) {
        console.error(
            "Get job applications error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   UPDATE APPLICATION STATUS
===================================================== */

export const updateApplicationStatus = async (req, res) => {
    try {
        const {
            applicationId
        } = req.params;

        const {
            status
        } = req.body;


        const allowedStatuses = [
            "reviewing",
            "shortlisted",
            "interview",
            "rejected",
            "hired"
        ];


        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status.",
                success: false
            });
        }


        const application = await Application.findById(
            applicationId
        );


        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }


        const job = await Job.findOne({
            _id: application.job,
            recruiter: req.userId
        });


        if (!job) {
            return res.status(403).json({
                message: "You are not authorized to update this application.",
                success: false
            });
        }


        const now = new Date();


        application.status = status;

        application.lastStatusChangedAt = now;


        /*
        The first meaningful recruiter action counts
        as a recruiter response.
        */

        if (!application.recruiterRespondedAt) {
            application.recruiterRespondedAt = now;
        }


        await application.save();


        /*
        Updating an application is meaningful recruiter
        activity, so refresh the job's activity timestamp.
        */

        job.lastRecruiterActivity = now;

        await job.save();


        return res.status(200).json({
            message: "Application status updated successfully.",
            success: true,
            application
        });

    } catch (error) {
        console.error(
            "Update application status error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
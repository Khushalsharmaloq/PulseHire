import mongoose from "mongoose";

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

import { getJobFreshness } from "../utils/freshness.util.js";
import { calculateResponseDebt } from "../utils/responseDebt.util.js";

/* =====================================================
   HELPER
===================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/* =====================================================
   APPLY TO JOB
===================================================== */

export const applyToJob = async (req, res) => {
  try {
    const { jobId, intentResponse } = req.body;

    /* ==================== VALIDATION ==================== */

    if (!jobId || !intentResponse) {
      return res.status(400).json({
        message: "Job ID and intent response are required.",
        success: false,
      });
    }

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
        success: false,
      });
    }

    const normalizedIntent = String(intentResponse).trim();

    if (normalizedIntent.length < 20) {
      return res.status(400).json({
        message: "Intent response must be at least 20 characters.",
        success: false,
      });
    }

    if (normalizedIntent.length > 1000) {
      return res.status(400).json({
        message: "Intent response cannot exceed 1000 characters.",
        success: false,
      });
    }

    /* ==================== CHECK CANDIDATE ==================== */

    const candidate = await User.findById(req.userId).select("_id role");

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate account not found.",
        success: false,
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can apply for jobs.",
        success: false,
      });
    }

    /* ==================== FIND JOB ==================== */

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        message: "This job is no longer accepting applications.",
        success: false,
      });
    }

    /* ==================== DUPLICATE CHECK ==================== */

    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied to this job.",
        success: false,
      });
    }

    /* ==================== CREATE APPLICATION ==================== */

    const application = await Application.create({
      job: job._id,
      candidate: req.userId,
      recruiter: job.recruiter,
      intentResponse: normalizedIntent,
      status: "applied",
      appliedAt: new Date(),
      lastStatusChangedAt: new Date(),
    });

    /* ==================== RESPONSE ==================== */

    const populatedApplication = await Application.findById(application._id)
      .populate("job", "title location jobType status company")
      .populate("candidate", "fullname email phoneNumber")
      .populate("recruiter", "fullname email");

    return res.status(201).json({
      message: "Application submitted successfully.",
      success: true,
      application: populatedApplication,
    });
  } catch (error) {
    /*
        MongoDB unique-index protection.
        This also protects against two requests arriving
        at almost exactly the same time.
        */

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "You have already applied to this job.",
        success: false,
      });
    }

    console.error("Apply to job error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

/* =====================================================
   GET MY APPLICATIONS
===================================================== */

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.userId,
    })
      .populate("job", [
        "title",
        "location",
        "jobType",
        "status",
        "company",
        "lastRecruiterActivity",
      ])
      .populate("recruiter", "fullname email")
      .sort({
        appliedAt: -1,
      });

    const applicationsWithMetrics = applications.map((application) => {
      const responseDebt = application.recruiterRespondedAt
        ? null
        : calculateResponseDebt(application.appliedAt);

      const jobFreshness = application.job
        ? getJobFreshness(application.job.lastRecruiterActivity)
        : null;

      return {
        ...application.toObject(),

        responseDebt,

        jobFreshness,
      };
    });

    return res.status(200).json({
      success: true,
      applications: applicationsWithMetrics,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      message: "Unable to fetch your applications.",
      success: false,
    });
  }
};

/* =====================================================
   GET APPLICATIONS FOR ONE RECRUITER JOB
===================================================== */

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
        success: false,
      });
    }

    /* ==================== OWNERSHIP ==================== */

    const job = await Job.findOne({
      _id: jobId,
      recruiter: req.userId,
    }).populate("company", "name logo location");

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you do not own this job.",
        success: false,
      });
    }

    /* ==================== APPLICATIONS ==================== */

    const applications = await Application.find({
      job: jobId,
      recruiter: req.userId,
    })
      .populate("candidate", ["fullname", "email", "phoneNumber", "profile"])
      .sort({
        appliedAt: -1,
      });

    const applicationsWithMetrics = applications.map((application) => {
      const responseDebt = application.recruiterRespondedAt
        ? null
        : calculateResponseDebt(application.appliedAt);

      return {
        ...application.toObject(),

        responseDebt,
      };
    });

    /* ==================== SUMMARY ==================== */

    const summary = {
      total: applications.length,

      applied: applications.filter(
        (application) => application.status === "applied",
      ).length,

      reviewing: applications.filter(
        (application) => application.status === "reviewing",
      ).length,

      shortlisted: applications.filter(
        (application) => application.status === "shortlisted",
      ).length,

      interview: applications.filter(
        (application) => application.status === "interview",
      ).length,

      rejected: applications.filter(
        (application) => application.status === "rejected",
      ).length,

      hired: applications.filter(
        (application) => application.status === "hired",
      ).length,
    };

    return res.status(200).json({
      success: true,

      job,

      applications: applicationsWithMetrics,

      summary,
    });
  } catch (error) {
    console.error("Get job applications error:", error);

    return res.status(500).json({
      message: "Unable to fetch job applications.",
      success: false,
    });
  }
};

/* =====================================================
   UPDATE APPLICATION STATUS
===================================================== */

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { status } = req.body;

    if (!isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID.",
        success: false,
      });
    }

    /* ==================== ALLOWED STATUS ==================== */

    const allowedStatuses = [
      "reviewing",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
        success: false,
      });
    }

    /* ==================== GET APPLICATION ==================== */

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    /* ==================== CHECK JOB OWNERSHIP ==================== */

    const job = await Job.findOne({
      _id: application.job,
      recruiter: req.userId,
    });

    if (!job) {
      return res.status(403).json({
        message: "You are not authorized to update this application.",
        success: false,
      });
    }

    /* ==================== TERMINAL STATUS ==================== */

    const terminalStatuses = ["rejected", "hired"];

    if (terminalStatuses.includes(application.status)) {
      return res.status(409).json({
        message: `This application is already ${application.status}.`,
        success: false,
      });
    }

    /* ==================== STATE TRANSITIONS ==================== */

    const allowedTransitions = {
      applied: ["reviewing", "rejected"],

      reviewing: ["shortlisted", "rejected"],

      shortlisted: ["interview", "rejected"],

      interview: ["hired", "rejected"],
    };

    const currentStatus = application.status;

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return res.status(409).json({
        message: `Cannot change application from ${currentStatus} to ${status}.`,
        success: false,
      });
    }

    /* ==================== UPDATE ==================== */

    const now = new Date();

    application.status = status;

    application.lastStatusChangedAt = now;

    /*
        The first recruiter status change
        counts as recruiter response.
        */

    if (!application.recruiterRespondedAt) {
      application.recruiterRespondedAt = now;
    }

    await application.save();

    /* ==================== UPDATE JOB ACTIVITY ==================== */

    job.lastRecruiterActivity = now;

    await job.save();

    /* ==================== RETURN ==================== */

    const updatedApplication = await Application.findById(application._id)
      .populate("candidate", "fullname email phoneNumber profile")
      .populate("job", "title location jobType status")
      .populate("recruiter", "fullname email");

    return res.status(200).json({
      message: "Application status updated successfully.",
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      message: "Unable to update application status.",
      success: false,
    });
  }
};

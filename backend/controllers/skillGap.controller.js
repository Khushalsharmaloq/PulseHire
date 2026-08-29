import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { SkillProof } from "../models/skillProof.model.js";
import { SkillGapResource } from "../models/skillGapResource.model.js";

import {
  calculateSkillGap,
} from "../utils/skillGap.util.js";


// =====================================================
// GET SKILL GAP FOR A JOB
// =====================================================

export const getSkillGapForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Get candidate's skill proofs
    const skillProofs = await SkillProof.find({
      candidate: req.userId,
    });

    // Calculate skill gap
    const skillGap = calculateSkillGap(
      job.skills || [],
      skillProofs
    );

    // Get resources for missing skills
    const resources = await SkillGapResource.find({
      skillName: {
        $in: skillGap.missingSkills,
      },
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      job: {
        id: job._id,
        title: job.title,
        requiredSkills: job.skills,
      },

      skillGap,

      resources,
    });

  } catch (error) {
    console.error(
      "Get skill gap error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};


// =====================================================
// GET SKILL GAP FOR A REJECTED APPLICATION
// =====================================================

export const getSkillGapForApplication = async (
  req,
  res
) => {
  try {
    const { applicationId } = req.params;

    // Find the application and its job
    const application = await Application.findById(
      applicationId
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Make sure the application belongs
    // to the currently logged-in candidate
    if (
      !application.candidate ||
      application.candidate.toString() !==
        req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view this application.",
        success: false,
      });
    }

    // Skill gap is only available after rejection
    if (application.status !== "rejected") {
      return res.status(400).json({
        message:
          "Skill gap is available after an application is rejected.",
        success: false,
      });
    }

    // Get candidate's skill proofs
    const skillProofs = await SkillProof.find({
      candidate: req.userId,
    });

    // Calculate skill gap
    const skillGap = calculateSkillGap(
      application.job.skills || [],
      skillProofs
    );

    // Get resources for missing skills
    const resources = await SkillGapResource.find({
      skillName: {
        $in: skillGap.missingSkills,
      },
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      application: {
        id: application._id,
        status: application.status,
      },

      job: {
        id: application.job._id,
        title: application.job.title,
        requiredSkills: application.job.skills,
      },

      skillGap,

      resources,
    });

  } catch (error) {
    console.error(
      "Get skill gap for application error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
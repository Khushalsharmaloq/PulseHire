import mongoose from "mongoose";

import { SkillProof } from "../models/skillProof.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";

/* =====================================================
   HELPERS
===================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeText = (value) => {
  return String(value || "").trim();
};

const escapeRegex = (value) => {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/* =====================================================
   SUBMIT SKILL PROOF
   Candidate
===================================================== */

export const submitSkillProof = async (req, res) => {
  try {
    const { skill, proofType, title, description, proofUrl } = req.body;

    /* ==================== NORMALIZE ==================== */

    const normalizedSkill = normalizeText(skill);

    const normalizedTitle = normalizeText(title);

    const normalizedDescription = normalizeText(description);

    const normalizedProofUrl = normalizeText(proofUrl);

    /* ==================== ALLOWED TYPES ==================== */

    const allowedProofTypes = [
      "project",
      "certificate",
      "github",
      "portfolio",
      "other",
    ];

    /* ==================== VALIDATION ==================== */

    if (!normalizedSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required.",
      });
    }

    if (normalizedSkill.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Skill name cannot exceed 80 characters.",
      });
    }

    if (!normalizedTitle) {
      return res.status(400).json({
        success: false,
        message: "Proof title is required.",
      });
    }

    if (normalizedTitle.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Proof title cannot exceed 120 characters.",
      });
    }

    if (normalizedDescription.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Proof description cannot exceed 1000 characters.",
      });
    }

    if (!proofType || !allowedProofTypes.includes(proofType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid proof type.",
      });
    }

    if (!normalizedProofUrl) {
      return res.status(400).json({
        success: false,
        message: "Proof URL is required.",
      });
    }

    try {
      const url = new URL(normalizedProofUrl);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return res.status(400).json({
          success: false,
          message: "Proof URL must use HTTP or HTTPS.",
        });
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid proof URL.",
      });
    }

    /* ==================== CANDIDATE ==================== */

    const candidate = await User.findById(req.userId).select(
      "_id role profile.skills fullname email",
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate account not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can submit skill proofs.",
      });
    }

    /* ==================== CLAIMED SKILL ==================== */

    const claimedSkills = candidate.profile?.skills || [];

    const normalizedTargetSkill = normalizedSkill.toLowerCase();

    const claimedSkill = claimedSkills.find(
      (candidateSkill) =>
        normalizeText(candidateSkill).toLowerCase() === normalizedTargetSkill,
    );

    if (!claimedSkill) {
      return res.status(400).json({
        success: false,
        message:
          "You can only submit proof for a skill already claimed on your profile.",
      });
    }

    /* ==================== DUPLICATE PENDING ==================== */

    const existingPendingProof = await SkillProof.findOne({
      candidate: req.userId,

      skill: {
        $regex: `^${escapeRegex(claimedSkill)}$`,

        $options: "i",
      },

      status: "pending",
    });

    if (existingPendingProof) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending proof for this skill.",
      });
    }

    /* ==================== CREATE ==================== */

    const skillProof = await SkillProof.create({
      candidate: req.userId,

      skill: claimedSkill,

      proofType,

      title: normalizedTitle,

      description: normalizedDescription,

      proofUrl: normalizedProofUrl,

      status: "pending",
    });

    /* ==================== RETURN ==================== */

    const populatedProof = await SkillProof.findById(skillProof._id).populate(
      "candidate",
      "fullname email",
    );

    return res.status(201).json({
      success: true,

      message:
        "Skill proof submitted successfully and is pending recruiter review.",

      skillProof: populatedProof,
    });
  } catch (error) {
    console.error("Submit skill proof error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your skill proof.",
    });
  }
};

/* =====================================================
   GET MY SKILL PROOFS
   Candidate
===================================================== */

export const getMySkillProofs = async (req, res) => {
  try {
    const skillProofs = await SkillProof.find({
      candidate: req.userId,
    })
      .populate("reviewedBy", "fullname email")
      .sort({
        createdAt: -1,
      })
      .lean();

    const summary = {
      total: skillProofs.length,

      pending: skillProofs.filter((proof) => proof.status === "pending").length,

      approved: skillProofs.filter((proof) => proof.status === "approved")
        .length,

      rejected: skillProofs.filter((proof) => proof.status === "rejected")
        .length,
    };

    return res.status(200).json({
      success: true,

      skillProofs,

      summary,
    });
  } catch (error) {
    console.error("Get my skill proofs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your skill proofs.",
    });
  }
};

/* =====================================================
   GET ALL SKILL PROOFS FOR RECRUITER REVIEW
   Recruiter
===================================================== */

export const getRecruiterSkillProofs = async (req, res) => {
  try {
    const { status } = req.query;
    const allowedStatuses = ["pending", "approved", "rejected"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill proof status.",
      });
    }

    const candidateIds = await Application.distinct("candidate", {
      recruiter: req.userId,
    });

    if (candidateIds.length === 0) {
      return res.status(200).json({
        success: true,
        skillProofs: [],
        summary: { total: 0, pending: 0, approved: 0, rejected: 0 },
      });
    }

    const filter = {
      candidate: { $in: candidateIds },
    };

    if (status) {
      filter.status = status;
    }

    const skillProofs = await SkillProof.find(filter)
      .populate("candidate", "fullname email profile.skills")
      .populate("reviewedBy", "fullname email")
      .sort({ createdAt: -1 })
      .lean();

    const summary = {
      total: skillProofs.length,
      pending: skillProofs.filter((proof) => proof.status === "pending").length,
      approved: skillProofs.filter((proof) => proof.status === "approved").length,
      rejected: skillProofs.filter((proof) => proof.status === "rejected").length,
    };

    return res.status(200).json({
      success: true,
      skillProofs,
      summary,
    });
  } catch (error) {
    console.error("Get recruiter skill proofs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch skill proofs.",
    });
  }
};

/* =====================================================
   REVIEW SKILL PROOF
   Recruiter
===================================================== */

export const reviewSkillProof = async (req, res) => {
  try {
    const { proofId } = req.params;

    const { status, recruiterComment } = req.body;

    /* ==================== ID ==================== */

    if (!isValidObjectId(proofId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill proof ID.",
      });
    }

    /* ==================== STATUS ==================== */

    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Review status must be approved or rejected.",
      });
    }

    /* ==================== COMMENT ==================== */

    const normalizedComment = normalizeText(recruiterComment);

    if (normalizedComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Recruiter comment cannot exceed 1000 characters.",
      });
    }

    if (status === "rejected" && !normalizedComment) {
      return res.status(400).json({
        success: false,
        message: "A reason is required when rejecting a skill proof.",
      });
    }

    /* ==================== FIND PROOF ==================== */

    const skillProof = await SkillProof.findById(proofId);

    if (!skillProof) {
      return res.status(404).json({
        success: false,
        message: "Skill proof not found.",
      });
    }

    /* ==================== STATE PROTECTION ==================== */

    if (skillProof.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "This skill proof has already been reviewed.",
      });
    }

    /* ==================== CHECK CANDIDATE ==================== */

    const candidate = await User.findById(skillProof.candidate).select(
      "_id role profile.skills",
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "The candidate associated with this proof no longer exists.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(409).json({
        success: false,
        message: "Skill proof belongs to an invalid candidate account.",
      });
    }

    const recruiterHasCandidate = await Application.exists({
      recruiter: req.userId,
      candidate: candidate._id,
    });

    if (!recruiterHasCandidate) {
      return res.status(403).json({
        success: false,
        message:
          "You can only review skill proofs for candidates who applied to one of your jobs.",
      });
    }

    /* ==================== UPDATE ==================== */

    const now = new Date();

    skillProof.status = status;

    skillProof.recruiterComment = normalizedComment;

    skillProof.reviewedBy = req.userId;

    skillProof.reviewedAt = now;

    await skillProof.save();

    /* ==================== POPULATE ==================== */

    const updatedProof = await SkillProof.findById(skillProof._id)
      .populate("candidate", "fullname email profile.skills")
      .populate("reviewedBy", "fullname email")
      .lean();

    /* ==================== RESPONSE ==================== */

    return res.status(200).json({
      success: true,

      message:
        status === "approved"
          ? "Skill proof approved successfully."
          : "Skill proof rejected successfully.",

      skillProof: updatedProof,
    });
  } catch (error) {
    console.error("Review skill proof error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to review this skill proof.",
    });
  }
};

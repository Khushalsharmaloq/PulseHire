import { SkillProof } from "../models/skillProof.model.js";
import { User } from "../models/user.model.js";

export const submitSkillProof = async (req, res) => {
  try {
    const {
      skill,
      proofType,
      title,
      description,
      proofUrl,
    } = req.body;

    const normalizedSkill = skill?.trim();
    const normalizedTitle = title?.trim();
    const normalizedDescription = description?.trim() || "";
    const normalizedProofUrl = proofUrl?.trim() || "";

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!normalizedSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required.",
      });
    }

    if (!proofType) {
      return res.status(400).json({
        success: false,
        message: "Proof type is required.",
      });
    }

    if (!normalizedTitle) {
      return res.status(400).json({
        success: false,
        message: "Proof title is required.",
      });
    }

    /* =====================================================
       VALIDATE PROOF TYPE
    ===================================================== */

    const allowedProofTypes = [
      "project",
      "certificate",
      "github",
      "portfolio",
      "other",
    ];

    if (!allowedProofTypes.includes(proofType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid proof type.",
      });
    }

    /* =====================================================
       GET CANDIDATE
    ===================================================== */

    const candidate = await User.findById(req.userId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can submit skill proof.",
      });
    }

    /* =====================================================
       VALIDATE CLAIMED SKILL
    ===================================================== */

    const claimedSkills = candidate.profile?.skills || [];

    const matchedSkill = claimedSkills.find(
      (candidateSkill) =>
        candidateSkill.trim().toLowerCase() ===
        normalizedSkill.toLowerCase()
    );

    if (!matchedSkill) {
      return res.status(400).json({
        success: false,
        message:
          "You can only submit proof for a skill already added to your profile.",
      });
    }

    /* =====================================================
       PREVENT MULTIPLE PENDING PROOFS
    ===================================================== */

    const existingPendingProof = await SkillProof.findOne({
      candidate: candidate._id,
      skill: matchedSkill,
      status: "pending",
    });

    if (existingPendingProof) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a pending proof submission for this skill.",
      });
    }

    /* =====================================================
       CREATE SKILL PROOF
    ===================================================== */

    const skillProof = await SkillProof.create({
      candidate: candidate._id,
      skill: matchedSkill,
      proofType,
      title: normalizedTitle,
      description: normalizedDescription,
      proofUrl: normalizedProofUrl,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Skill proof submitted successfully.",
      skillProof,
    });
  } catch (error) {
    console.error("Submit skill proof error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit skill proof.",
    });
  }
};

export const getMySkillProofs = async (req, res) => {
  try {
    const skillProofs = await SkillProof.find({
      candidate: req.userId,
    })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "fullname email");

    return res.status(200).json({
      success: true,
      skillProofs,
    });
  } catch (error) {
    console.error("Get my skill proofs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your skill proofs.",
    });
  }
};

export const getRecruiterSkillProofs = async (req, res) => {
  try {
    const skillProofs = await SkillProof.find()
      .sort({ createdAt: -1 })
      .populate("candidate", "fullname email profile")
      .populate("reviewedBy", "fullname email");

    return res.status(200).json({
      success: true,
      skillProofs,
    });
  } catch (error) {
    console.error("Get recruiter skill proofs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch skill proofs.",
    });
  }
};

export const reviewSkillProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { status, recruiterComment } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Review status must be approved or rejected.",
      });
    }

    const skillProof = await SkillProof.findById(proofId);

    if (!skillProof) {
      return res.status(404).json({
        success: false,
        message: "Skill proof not found.",
      });
    }

    if (skillProof.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending skill proofs can be reviewed.",
      });
    }

    skillProof.status = status;
    skillProof.recruiterComment =
      typeof recruiterComment === "string"
        ? recruiterComment.trim()
        : "";

    skillProof.reviewedBy = req.userId;
    skillProof.reviewedAt = new Date();

    await skillProof.save();

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Skill proof approved successfully."
          : "Skill proof rejected successfully.",
      skillProof,
    });
  } catch (error) {
    console.error("Review skill proof error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to review skill proof.",
    });
  }
};
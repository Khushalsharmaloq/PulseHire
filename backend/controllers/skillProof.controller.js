import { SkillProof } from "../models/skillProof.model.js";
import { User } from "../models/user.model.js";

/*
|--------------------------------------------------------------------------
| Candidate: Submit Skill Proof
|--------------------------------------------------------------------------
*/

export const submitSkillProof = async (req, res) => {
  try {
    const {
      skill,
      proofType,
      title,
      description,
      proofUrl,
    } = req.body;

    const normalizedSkill = String(skill || "").trim();
    const normalizedTitle = String(title || "").trim();
    const normalizedDescription = String(
      description || "",
    ).trim();
    const normalizedProofUrl = String(
      proofUrl || "",
    ).trim();

    const allowedProofTypes = [
      "project",
      "certificate",
      "github",
      "portfolio",
      "other",
    ];

    if (!normalizedSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required.",
      });
    }

    if (!normalizedTitle) {
      return res.status(400).json({
        success: false,
        message: "Proof title is required.",
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

    const candidate = await User.findById(req.userId);

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

    const claimedSkills = candidate.profile?.skills || [];

    const hasClaimedSkill = claimedSkills.some(
      (candidateSkill) =>
        String(candidateSkill).trim().toLowerCase() ===
        normalizedSkill.toLowerCase(),
    );

    if (!hasClaimedSkill) {
      return res.status(400).json({
        success: false,
        message:
          "You can only submit proof for a skill already claimed on your profile.",
      });
    }

    const existingPendingProof = await SkillProof.findOne({
      candidate: req.userId,
      skill: {
        $regex: `^${normalizedSkill}$`,
        $options: "i",
      },
      status: "pending",
    });

    if (existingPendingProof) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a pending proof for this skill.",
      });
    }

    const skillProof = await SkillProof.create({
      candidate: req.userId,
      skill: normalizedSkill,
      proofType,
      title: normalizedTitle,
      description: normalizedDescription,
      proofUrl: normalizedProofUrl,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Skill proof submitted successfully and is pending review.",
      skillProof,
    });
  } catch (error) {
    console.error("Submit skill proof error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your skill proof.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Candidate: Get My Skill Proofs
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Recruiter: Get Skill Proofs
|--------------------------------------------------------------------------
*/

export const getRecruiterSkillProofs = async (req, res) => {
  try {
    const skillProofs = await SkillProof.find({})
      .sort({
        status: 1,
        createdAt: -1,
      })
      .populate(
        "candidate",
        "fullname email profile.skills",
      )
      .populate(
        "reviewedBy",
        "fullname email",
      );

    return res.status(200).json({
      success: true,
      skillProofs,
    });
  } catch (error) {
    console.error(
      "Get recruiter skill proofs error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch skill proofs.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Recruiter: Review Skill Proof
|--------------------------------------------------------------------------
*/

export const reviewSkillProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { status, recruiterComment } = req.body;

    const allowedStatuses = [
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Review status must be approved or rejected.",
      });
    }

    const skillProof = await SkillProof.findById(
      proofId,
    );

    if (!skillProof) {
      return res.status(404).json({
        success: false,
        message: "Skill proof not found.",
      });
    }

    if (skillProof.status !== "pending") {
      return res.status(409).json({
        success: false,
        message:
          "This skill proof has already been reviewed.",
      });
    }

    const normalizedComment = String(
      recruiterComment || "",
    ).trim();

    if (
      status === "rejected" &&
      !normalizedComment
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide feedback when rejecting a skill proof.",
      });
    }

    skillProof.status = status;
    skillProof.recruiterComment =
      normalizedComment;
    skillProof.reviewedBy = req.userId;
    skillProof.reviewedAt = new Date();

    await skillProof.save();

    const updatedProof =
      await SkillProof.findById(skillProof._id)
        .populate(
          "candidate",
          "fullname email profile.skills",
        )
        .populate(
          "reviewedBy",
          "fullname email",
        );

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Skill proof approved successfully."
          : "Skill proof rejected successfully.",
      skillProof: updatedProof,
    });
  } catch (error) {
    console.error(
      "Review skill proof error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to review this skill proof.",
    });
  }
};
import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| VALIDATE PROOF URL
|--------------------------------------------------------------------------
*/

const isValidProofUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const skillProofSchema = new mongoose.Schema(
  {
    /* =================================================
           CANDIDATE
        ================================================= */

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =================================================
           CLAIMED SKILL
        ================================================= */

    skill: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    /* =================================================
           TYPE OF EVIDENCE
        ================================================= */

    proofType: {
      type: String,
      enum: ["project", "certificate", "github", "portfolio", "other"],
      required: true,
    },

    /* =================================================
           TITLE
        ================================================= */

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    /* =================================================
           DESCRIPTION
        ================================================= */

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    /* =================================================
           EVIDENCE URL
        ================================================= */

    proofUrl: {
      type: String,
      required: true,
      trim: true,

      validate: {
        validator: isValidProofUrl,

        message: "Proof URL must be a valid HTTP or HTTPS URL.",
      },
    },

    /* =================================================
           REVIEW STATUS
        ================================================= */

    status: {
      type: String,

      enum: ["pending", "approved", "rejected"],

      default: "pending",

      index: true,
    },

    /* =================================================
           RECRUITER FEEDBACK
        ================================================= */

    recruiterComment: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    /* =================================================
           REVIEWER
        ================================================= */

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /* =================================================
           REVIEW TIME
        ================================================= */

    reviewedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
|
| These make the main PulseHire proof queries faster:
|
| 1. Candidate → all proofs
| 2. Candidate → proofs for one skill
| 3. Candidate → approved proofs
| 4. Recruiter → pending proofs
|
|--------------------------------------------------------------------------
*/

skillProofSchema.index({
  candidate: 1,
  status: 1,
});

skillProofSchema.index({
  candidate: 1,
  skill: 1,
  status: 1,
});

skillProofSchema.index({
  status: 1,
  createdAt: -1,
});

skillProofSchema.index({
  reviewedBy: 1,
  reviewedAt: -1,
});

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

export const SkillProof = mongoose.model("SkillProof", skillProofSchema);

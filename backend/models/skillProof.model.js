import mongoose from "mongoose";

const skillProofSchema = new mongoose.Schema(
    {
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        skillName: {
            type: String,
            required: true,
            trim: true
        },

        proofType: {
            type: String,
            enum: [
                "certificate",
                "github",
                "project",
                "portfolio",
                "assessment"
            ],
            required: true
        },

        proofUrl: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },

        verifiedAt: {
            type: Date,
            default: null
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        verificationRequestedAt: {
            type: Date,
            default: Date.now
        },

        lastReverificationRequestedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

skillProofSchema.index({
    candidate: 1,
    skillName: 1
});

export const SkillProof = mongoose.model(
    "SkillProof",
    skillProofSchema
);
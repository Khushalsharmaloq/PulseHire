import mongoose from "mongoose";

const skillGapResourceSchema = new mongoose.Schema(
    {
        skillName: {
            type: String,
            required: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        resourceUrl: {
            type: String,
            required: true,
            trim: true
        },

        resourceType: {
            type: String,
            enum: [
                "course",
                "documentation",
                "tutorial",
                "project",
                "practice"
            ],
            required: true
        },

        cost: {
            type: String,
            enum: [
                "free",
                "low-cost"
            ],
            default: "free"
        },

        difficulty: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced"
            ],
            default: "beginner"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

skillGapResourceSchema.index({
    skillName: 1
});

export const SkillGapResource = mongoose.model(
    "SkillGapResource",
    skillGapResourceSchema
);
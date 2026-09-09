import mongoose from "mongoose";

const learningResourceSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    resourceType: {
      type: String,
      enum: [
        "course",
        "documentation",
        "tutorial",
        "project",
        "practice",
        "video",
        "other",
      ],
      default: "course",
    },

    difficulty: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced",
      ],
      default: "intermediate",
    },

    durationMinutes: {
      type: Number,
      default: 60,
      min: 1,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LearningResource =
  mongoose.model(
    "LearningResource",
    learningResourceSchema
  );
import mongoose from "mongoose";

const learningProgressSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningResource",
      required: true,
      index: true,
    },

    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
      index: true,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

learningProgressSchema.index(
  {
    candidate: 1,
    resource: 1,
  },
  {
    unique: true,
  },
);

export const LearningProgress = mongoose.model(
  "LearningProgress",
  learningProgressSchema,
);

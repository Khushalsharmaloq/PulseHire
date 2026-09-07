import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      required: true,
    },

    profile: {
      bio: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      resume: {
        type: String,
        default: "",
      },

      resumeOriginalName: {
        type: String,
        default: "",
      },

      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);

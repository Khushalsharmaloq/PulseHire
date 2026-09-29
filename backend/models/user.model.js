import mongoose from "mongoose";

const recruiterVerificationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["not_required", "pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

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
      index: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      required: true,
      index: true,
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },

    recruiterVerification: {
      type: recruiterVerificationSchema,
      default: () => ({}),
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

      resumePublicId: {
        type: String,
        default: "",
        select: false,
      },

      resumeResourceType: {
        type: String,
        default: "raw",
        select: false,
      },

      resumeDeliveryType: {
        type: String,
        default: "authenticated",
        select: false,
      },

      resumeFormat: {
        type: String,
        default: "pdf",
        select: false,
      },

      profilePhoto: {
        type: String,
        default: "",
      },

      profilePhotoPublicId: {
        type: String,
        default: "",
        select: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1, "recruiterVerification.status": 1, createdAt: -1 });

export const User = mongoose.model("User", userSchema);

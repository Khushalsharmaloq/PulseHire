import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        intentResponse: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 1000
        },

        status: {
            type: String,
            enum: [
                "applied",
                "reviewing",
                "shortlisted",
                "interview",
                "rejected",
                "hired"
            ],
            default: "applied"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        },

        recruiterRespondedAt: {
            type: Date,
            default: null
        },

        lastStatusChangedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


/*
Prevent the same candidate from applying
to the same job more than once.
*/

applicationSchema.index(
    {
        job: 1,
        candidate: 1
    },
    {
        unique: true
    }
);


export const Application = mongoose.model(
    "Application",
    applicationSchema
);
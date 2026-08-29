import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        website: {
            type: String,
            default: "",
            trim: true
        },

        location: {
            type: String,
            default: "",
            trim: true
        },

        logo: {
            type: String,
            default: ""
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Company = mongoose.model(
    "Company",
    companySchema
);
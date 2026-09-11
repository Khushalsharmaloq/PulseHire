import mongoose from "mongoose";


/*
|--------------------------------------------------------------------------
| APPLICATION SCHEMA
|--------------------------------------------------------------------------
|
| PulseHire application lifecycle:
|
| applied
|   ↓
| reviewing
|   ↓
| shortlisted
|   ↓
| interview
|   ↓
| hired
|
| At any review stage an application can also be rejected.
|
|--------------------------------------------------------------------------
*/


const applicationSchema = new mongoose.Schema(
    {
        /* =================================================
           JOB
        ================================================= */

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true
        },


        /* =================================================
           CANDIDATE
        ================================================= */

        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },


        /* =================================================
           RECRUITER
        ================================================= */

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },


        /* =================================================
           CANDIDATE INTENT
        ================================================= */

        intentResponse: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 1000
        },


        /* =================================================
           STATUS
        ================================================= */

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

            default: "applied",
            required: true,
            index: true
        },


        /* =================================================
           APPLICATION TIME
        ================================================= */

        appliedAt: {
            type: Date,
            default: Date.now,
            index: true
        },


        /* =================================================
           FIRST RECRUITER RESPONSE
        ================================================= */

        recruiterRespondedAt: {
            type: Date,
            default: null
        },


        /* =================================================
           LAST STATUS CHANGE
        ================================================= */

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
|--------------------------------------------------------------------------
| UNIQUE APPLICATION
|--------------------------------------------------------------------------
|
| One candidate may apply to a particular job only once.
|
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| RECRUITER APPLICATION QUERIES
|--------------------------------------------------------------------------
|
| Frequently needed for:
|
| recruiter dashboard
| recruiter applications
| analytics
| candidate intelligence
|
|--------------------------------------------------------------------------
*/

applicationSchema.index({
    recruiter: 1,
    status: 1,
    appliedAt: -1
});


/*
|--------------------------------------------------------------------------
| JOB APPLICATION QUERIES
|--------------------------------------------------------------------------
*/

applicationSchema.index({
    job: 1,
    status: 1,
    appliedAt: -1
});


/*
|--------------------------------------------------------------------------
| CANDIDATE APPLICATION QUERIES
|--------------------------------------------------------------------------
*/

applicationSchema.index({
    candidate: 1,
    status: 1,
    appliedAt: -1
});


/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

export const Application = mongoose.model(
    "Application",
    applicationSchema
);
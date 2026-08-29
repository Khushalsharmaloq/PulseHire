import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import skillProofRoute from "./routes/skillProof.route.js";
import skillGapRoute from "./routes/skillGap.route.js";
import skillGapAdminRoute from "./routes/skillGapAdmin.route.js";

dotenv.config();

const app = express();


/* ==================== MIDDLEWARE ==================== */

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(cookieParser());


/* ==================== TEST ROUTE ==================== */

app.get("/", (req, res) => {
    res.status(200).json({
        message: "PulseHire backend is running",
        success: true
    });
});


/* ==================== API ROUTES ==================== */

app.use(
    "/api/v1/user",
    userRoute
);

app.use(
    "/api/v1/company",
    companyRoute
);

app.use(
    "/api/v1/job",
    jobRoute
);

app.use(
    "/api/v1/application",
    applicationRoute
);

app.use(
    "/api/v1/skill-proof",
    skillProofRoute
);

app.use(
    "/api/v1/skill-gap",
    skillGapRoute
);

app.use(
    "/api/v1/skill-gap-admin",
    skillGapAdminRoute
);


/* ==================== SERVER ==================== */

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(
        `PulseHire server running on port ${PORT}`
    );
});


/* ==================== DATABASE ==================== */

connectDB();
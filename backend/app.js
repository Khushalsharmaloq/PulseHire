import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import learningRoute from "./routes/learning.route.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import skillProofRoute from "./routes/skillProof.route.js";
import skillGapRoute from "./routes/skillGap.route.js";
import skillGapAdminRoute from "./routes/skillGapAdmin.route.js";
import candidateRoute from "./routes/candidate.route.js";
import analyticsRoute from "./routes/analytics.route.js";

import { getAllowedOrigins } from "./config/env.js";
import { securityHeaders } from "./middlewares/securityHeaders.middleware.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();
const allowedOrigins = new Set(getAllowedOrigins());

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

/* ==================== MIDDLEWARE ==================== */

app.use(securityHeaders);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      const error = new Error("Origin is not allowed by CORS policy.");
      error.statusCode = 403;
      callback(error);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

/* ==================== HEALTH ROUTE ==================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PulseHire backend is running",
  });
});

/* ==================== API ROUTES ==================== */

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/skill-proof", skillProofRoute);
app.use("/api/v1/skill-gap", skillGapRoute);
app.use("/api/v1/skill-gap-admin", skillGapAdminRoute);
app.use("/api/v1/learning", learningRoute);
app.use("/api/v1/candidate", candidateRoute);
app.use("/api/v1/analytics", analyticsRoute);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

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

import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";
const app = express();

/* ==================== MIDDLEWARE ==================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

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

/*
|--------------------------------------------------------------------------
| 404 + GLOBAL ERROR HANDLING
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);

app.use(errorHandler);

app.use("/api/v1/candidate", candidateRoute);

app.use("/api/v1/analytics", analyticsRoute);

export default app;

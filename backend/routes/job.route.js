import express from "express";

import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  updateJobStatus,
} from "../controllers/job.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { requireVerifiedRecruiter } from "../middlewares/recruiterVerification.middleware.js";
import { publicJobRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

/* =====================================================
   PUBLIC JOB DISCOVERY
===================================================== */

router.get("/all", publicJobRateLimiter, getAllJobs);

/* =====================================================
   RECRUITER
===================================================== */

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  createJob,
);

router.get(
  "/my",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  getMyJobs,
);

router.put(
  "/:jobId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  updateJob,
);

router.patch(
  "/:jobId/status",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  updateJobStatus,
);

/* =====================================================
   CANDIDATE
===================================================== */

router.get("/:id", isAuthenticated, authorizeRoles("candidate"), getJobById);

export default router;

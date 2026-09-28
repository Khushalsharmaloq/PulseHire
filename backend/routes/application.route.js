import express from "express";

import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";
import { requireVerifiedRecruiter } from "../middlewares/recruiterVerification.middleware.js";

const router = express.Router();

/* ==================== CANDIDATE ==================== */

router.post("/apply", isAuthenticated, authorizeRoles("candidate"), applyToJob);

router.get(
  "/my",
  isAuthenticated,
  authorizeRoles("candidate"),
  getMyApplications,
);

/* ==================== RECRUITER ==================== */

router.get(
  "/recruiter",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  getRecruiterApplications,
);

router.get(
  "/job/:jobId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  getJobApplications,
  getRecruiterApplications,
);

router.patch(
  "/:applicationId/status",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  updateApplicationStatus,
);

export default router;

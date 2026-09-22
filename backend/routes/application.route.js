import express from "express";

import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

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
  "/job/:jobId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getJobApplications,
);

router.patch(
  "/:applicationId/status",
  isAuthenticated,
  authorizeRoles("recruiter"),
  updateApplicationStatus,
);

export default router;

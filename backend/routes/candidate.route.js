import express from "express";

import {
  getRecruiterCandidates,
  getRecruiterCandidateById,
  downloadRecruiterCandidateResume,
} from "../controllers/candidate.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { requireVerifiedRecruiter } from "../middlewares/recruiterVerification.middleware.js";

const router = express.Router();

router.get(
  "/recruiter",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  getRecruiterCandidates,
);

router.get(
  "/recruiter/:candidateId/resume",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  downloadRecruiterCandidateResume,
);

router.get(
  "/recruiter/:candidateId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  requireVerifiedRecruiter,
  getRecruiterCandidateById,
);

export default router;

import express from "express";

import {
  getRecruiterCandidates,
  getRecruiterCandidateById,
} from "../controllers/candidate.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* =====================================================
   RECRUITER CANDIDATE INTELLIGENCE
===================================================== */

router.get(
  "/recruiter",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getRecruiterCandidates,
);

/* =====================================================
   ONE CANDIDATE
===================================================== */

router.get(
  "/recruiter/:candidateId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getRecruiterCandidateById,
);

export default router;

import express from "express";

import {
  submitSkillProof,
  getMySkillProofs,
  getRecruiterSkillProofs,
  reviewSkillProof,
} from "../controllers/skillProof.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Candidate Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("candidate"),
  submitSkillProof,
);

router.get(
  "/my",
  isAuthenticated,
  authorizeRoles("candidate"),
  getMySkillProofs,
);

/*
|--------------------------------------------------------------------------
| Recruiter Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/recruiter",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getRecruiterSkillProofs,
);

router.patch(
  "/:proofId/review",
  isAuthenticated,
  authorizeRoles("recruiter"),
  reviewSkillProof,
);

export default router;
import express from "express";

import {
  getSkillGapForJob,
  getSkillGapForApplication,
} from "../controllers/skillGap.controller.js";

import {
  isAuthenticated,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";


const router = express.Router();


// =====================================================
// GET SKILL GAP FOR A JOB
// =====================================================

router.get(
  "/job/:jobId",
  isAuthenticated,
  authorizeRoles("candidate"),
  getSkillGapForJob
);


// =====================================================
// GET SKILL GAP FOR A REJECTED APPLICATION
// =====================================================

router.get(
  "/application/:applicationId",
  isAuthenticated,
  authorizeRoles("candidate"),
  getSkillGapForApplication
);


export default router;
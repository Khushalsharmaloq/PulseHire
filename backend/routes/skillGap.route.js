import express from "express";

import {
  getSkillGapIntelligence,
} from "../controllers/skillGap.controller.js";

import {
  isAuthenticated,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";


const router = express.Router();


// =====================================================
// CANDIDATE SKILL GAP INTELLIGENCE
// =====================================================

router.get(
  "/",
  isAuthenticated,
  authorizeRoles("candidate"),
  getSkillGapIntelligence
);


export default router;
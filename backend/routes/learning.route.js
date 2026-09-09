import express from "express";

import {
  getLearningResources,
  getMyLearningProgress,
  updateLearningProgress,
} from "../controllers/learning.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// =====================================================
// LEARNING RESOURCES
// =====================================================

router.get(
  "/resources",
  isAuthenticated,
  authorizeRoles("candidate"),
  getLearningResources
);


// =====================================================
// MY PROGRESS
// =====================================================

router.get(
  "/progress",
  isAuthenticated,
  authorizeRoles("candidate"),
  getMyLearningProgress
);


// =====================================================
// UPDATE PROGRESS
// =====================================================

router.put(
  "/progress",
  isAuthenticated,
  authorizeRoles("candidate"),
  updateLearningProgress
);

export default router;
import express from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  recruiterTest,
  candidateTest,
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";


const router = express.Router();


/* ==================== AUTH ROUTES ==================== */

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.post(
  "/logout",
  logout
);


/* ==================== USER ROUTES ==================== */

router.get(
  "/me",
  isAuthenticated,
  getCurrentUser
);


/* ==================== UPDATE PROFILE ==================== */

router.put(
  "/profile",
  isAuthenticated,
  updateProfile
);


/* ==================== ROLE TEST ROUTES ==================== */

router.get(
  "/recruiter-test",
  isAuthenticated,
  authorizeRoles("recruiter"),
  recruiterTest
);

router.get(
  "/candidate-test",
  isAuthenticated,
  authorizeRoles("candidate"),
  candidateTest
);


export default router;
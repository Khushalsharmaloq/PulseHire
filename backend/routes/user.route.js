import express from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
  recruiterTest,
  candidateTest,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import uploadResumeFile from "../middlewares/resumeUpload.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ==================== AUTH ROUTES ==================== */

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

/* ==================== USER ROUTES ==================== */

router.get("/me", isAuthenticated, getCurrentUser);

/* ==================== UPDATE PROFILE ==================== */

router.put("/profile", isAuthenticated, updateProfile);

/* ==================== UPLOAD RESUME ==================== */
router.put(
  "/profile/resume",
  isAuthenticated,
  uploadResumeFile.single("resume"),
  uploadResume,
);

/* ===================== UPLOAD PROFILE PHOTO ==================== */
router.put(
  "/profile/photo",
  isAuthenticated,
  upload.single("profilePhoto"),
  uploadProfilePhoto,
);

/* ==================== ROLE TEST ROUTES ==================== */

router.get(
  "/recruiter-test",
  isAuthenticated,
  authorizeRoles("recruiter"),
  recruiterTest,
);

router.get(
  "/candidate-test",
  isAuthenticated,
  authorizeRoles("candidate"),
  candidateTest,
);

export default router;

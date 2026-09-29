import express from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
  downloadOwnResume,
  recruiterTest,
  candidateTest,
  getRecruitersForAdmin,
  reviewRecruiterVerification,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import uploadResumeFile from "../middlewares/resumeUpload.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  authRateLimiter,
  registrationRateLimiter,
} from "../middlewares/rateLimit.middleware.js";
import {
  validateImageSignature,
  validatePdfSignature,
} from "../middlewares/fileSignature.middleware.js";

const router = express.Router();

/* ==================== AUTH ROUTES ==================== */

router.post("/register", registrationRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);

/* ==================== USER ROUTES ==================== */

router.get("/me", isAuthenticated, getCurrentUser);
router.put("/profile", isAuthenticated, updateProfile);

/* ==================== RESUME ==================== */

router.get("/profile/resume", isAuthenticated, downloadOwnResume);
router.put(
  "/profile/resume",
  isAuthenticated,
  uploadResumeFile.single("resume"),
  validatePdfSignature,
  uploadResume,
);

/* ==================== PROFILE PHOTO ==================== */

router.put(
  "/profile/photo",
  isAuthenticated,
  upload.single("profilePhoto"),
  validateImageSignature,
  uploadProfilePhoto,
);

/* ==================== ADMIN — RECRUITER VERIFICATION ==================== */

router.get(
  "/admin/recruiters",
  isAuthenticated,
  authorizeRoles("admin"),
  getRecruitersForAdmin,
);

router.patch(
  "/admin/recruiters/:recruiterId/verification",
  isAuthenticated,
  authorizeRoles("admin"),
  reviewRecruiterVerification,
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

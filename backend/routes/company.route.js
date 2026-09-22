import express from "express";

import {
  createCompany,
  getMyCompanies,
  getCompanyById,
  updateCompany,
  getCompanyJobs,
} from "../controllers/company.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* =====================================================
   RECRUITER — CREATE
===================================================== */

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("recruiter"),
  createCompany,
);

/* =====================================================
   RECRUITER — MY COMPANIES
===================================================== */

router.get("/my", isAuthenticated, authorizeRoles("recruiter"), getMyCompanies);

/* =====================================================
   RECRUITER — COMPANY JOBS
===================================================== */

router.get(
  "/:companyId/jobs",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getCompanyJobs,
);

/* =====================================================
   RECRUITER — UPDATE
===================================================== */

router.put(
  "/:companyId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  updateCompany,
);

/* =====================================================
   COMPANY — GET ONE
===================================================== */

router.get("/:companyId", isAuthenticated, getCompanyById);

export default router;

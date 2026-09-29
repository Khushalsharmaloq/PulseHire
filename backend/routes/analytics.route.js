import express from "express";

import {
    getRecruiterAnalytics
} from "../controllers/analytics.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

import { requireVerifiedRecruiter } from "../middlewares/recruiterVerification.middleware.js";


const router = express.Router();


/* =====================================================
   RECRUITER ANALYTICS
===================================================== */

router.get(
    "/recruiter",
    isAuthenticated,
    authorizeRoles("recruiter"),
    requireVerifiedRecruiter,
    getRecruiterAnalytics
);


export default router;
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


const router = express.Router();


/* =====================================================
   RECRUITER ANALYTICS
===================================================== */

router.get(
    "/recruiter",
    isAuthenticated,
    authorizeRoles("recruiter"),
    getRecruiterAnalytics
);


export default router;
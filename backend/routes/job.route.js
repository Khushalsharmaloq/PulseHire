import express from "express";

import {
    createJob,
    getAllJobs,
    getMyJobs,
    getJobById
} from "../controllers/job.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

const router = express.Router();


/* ==================== PUBLIC ==================== */

router.get(
    "/all",
    getAllJobs
);


/* ==================== RECRUITER ==================== */

router.post(
    "/create",
    isAuthenticated,
    authorizeRoles("recruiter"),
    createJob
);

router.get(
    "/my",
    isAuthenticated,
    authorizeRoles("recruiter"),
    getMyJobs
);


/* ==================== CANDIDATE ==================== */

router.get(
    "/:id",
    isAuthenticated,
    authorizeRoles("candidate"),
    getJobById
);


export default router;
import express from "express";

import {
    getLearningResources,
    getLearningResourceById,
    getMyLearningProgress,
    getResourceProgress,
    updateLearningProgress
} from "../controllers/learning.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";


const router = express.Router();


/* =====================================================
   LEARNING RESOURCES
===================================================== */

router.get(
    "/resources",
    isAuthenticated,
    authorizeRoles("candidate"),
    getLearningResources
);


/* =====================================================
   SINGLE RESOURCE
===================================================== */

router.get(
    "/resources/:resourceId",
    isAuthenticated,
    authorizeRoles("candidate"),
    getLearningResourceById
);


/* =====================================================
   MY PROGRESS
===================================================== */

router.get(
    "/progress",
    isAuthenticated,
    authorizeRoles("candidate"),
    getMyLearningProgress
);


/* =====================================================
   ONE RESOURCE PROGRESS
===================================================== */

router.get(
    "/progress/:resourceId",
    isAuthenticated,
    authorizeRoles("candidate"),
    getResourceProgress
);


/* =====================================================
   UPDATE PROGRESS
===================================================== */

router.put(
    "/progress",
    isAuthenticated,
    authorizeRoles("candidate"),
    updateLearningProgress
);


export default router;
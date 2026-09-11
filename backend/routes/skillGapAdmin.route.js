import express from "express";

import {
    createLearningResource,
    getAdminLearningResources,
    updateLearningResource,
    deactivateLearningResource
} from "../controllers/skillGapAdmin.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";


const router = express.Router();


/* =====================================================
   CREATE
===================================================== */

router.post(
    "/resource",
    isAuthenticated,
    authorizeRoles("admin"),
    createLearningResource
);


/* =====================================================
   GET
===================================================== */

router.get(
    "/resources",
    isAuthenticated,
    authorizeRoles("admin"),
    getAdminLearningResources
);


/* =====================================================
   UPDATE
===================================================== */

router.put(
    "/resource/:resourceId",
    isAuthenticated,
    authorizeRoles("admin"),
    updateLearningResource
);


/* =====================================================
   DEACTIVATE
===================================================== */

router.patch(
    "/resource/:resourceId/deactivate",
    isAuthenticated,
    authorizeRoles("admin"),
    deactivateLearningResource
);


export default router;
import express from "express";

import {
    addSkillProof,
    getMySkillProofs,
    getSkillProof,
    verifySkillProof,
    requestReverification
} from "../controllers/skillProof.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

const router = express.Router();


/* ==================== CANDIDATE ==================== */

router.post(
    "/add",
    isAuthenticated,
    authorizeRoles("candidate"),
    addSkillProof
);


router.get(
    "/my",
    isAuthenticated,
    authorizeRoles("candidate"),
    getMySkillProofs
);


router.get(
    "/:skillProofId",
    isAuthenticated,
    authorizeRoles("candidate"),
    getSkillProof
);


router.patch(
    "/:skillProofId/reverify",
    isAuthenticated,
    authorizeRoles("candidate"),
    requestReverification
);


/* ==================== RECRUITER ==================== */

router.patch(
    "/:skillProofId/verify",
    isAuthenticated,
    authorizeRoles("recruiter"),
    verifySkillProof
);


export default router;
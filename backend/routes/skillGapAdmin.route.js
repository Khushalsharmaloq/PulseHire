import express from "express";

import {
    createSkillGapResource
} from "../controllers/skillGapAdmin.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";


const router = express.Router();


router.post(
    "/resource",
    isAuthenticated,
    authorizeRoles("admin"),
    createSkillGapResource
);


export default router;
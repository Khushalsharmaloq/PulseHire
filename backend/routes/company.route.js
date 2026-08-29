import express from "express";

import {
    createCompany,
    getMyCompanies
} from "../controllers/company.controller.js";

import {
    isAuthenticated
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

const router = express.Router();


router.post(
    "/create",
    isAuthenticated,
    authorizeRoles("recruiter"),
    createCompany
);


router.get(
    "/my",
    isAuthenticated,
    authorizeRoles("recruiter"),
    getMyCompanies
);


export default router;
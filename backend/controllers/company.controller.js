import mongoose from "mongoose";

import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";


/* =====================================================
   HELPERS
===================================================== */

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


const normalizeText = (value) => {
    return String(value || "").trim();
};


/* =====================================================
   CREATE COMPANY
===================================================== */

export const createCompany = async (req, res) => {
    try {
        const {
            name,
            description,
            website,
            location,
            logo
        } = req.body;


        const normalizedName =
            normalizeText(name);

        const normalizedDescription =
            normalizeText(description);

        const normalizedWebsite =
            normalizeText(website);

        const normalizedLocation =
            normalizeText(location);

        const normalizedLogo =
            normalizeText(logo);


        /* ==================== VALIDATION ==================== */

        if (!normalizedName) {
            return res.status(400).json({
                success: false,
                message:
                    "Company name is required."
            });
        }


        if (normalizedName.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "Company name must contain at least 2 characters."
            });
        }


        if (normalizedName.length > 120) {
            return res.status(400).json({
                success: false,
                message:
                    "Company name cannot exceed 120 characters."
            });
        }


        /* ==================== DUPLICATE CHECK ==================== */

        const existingCompany =
            await Company.findOne({
                owner: req.userId,

                name: {
                    $regex:
                        `^${normalizedName.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        )}$`,
                    $options: "i"
                }
            });


        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message:
                    "You already created a company with this name."
            });
        }


        /* ==================== CREATE ==================== */

        const company =
            await Company.create({
                name:
                    normalizedName,

                description:
                    normalizedDescription,

                website:
                    normalizedWebsite,

                location:
                    normalizedLocation,

                logo:
                    normalizedLogo,

                owner:
                    req.userId
            });


        return res.status(201).json({
            success: true,

            message:
                "Company created successfully.",

            company
        });

    } catch (error) {

        console.error(
            "Create company error:",
            error
        );


        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "A company with this name already exists for your account."
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Unable to create company."
        });
    }
};


/* =====================================================
   GET MY COMPANIES
===================================================== */

export const getMyCompanies = async (
    req,
    res
) => {
    try {

        const companies =
            await Company.find({
                owner: req.userId
            })
                .sort({
                    createdAt: -1
                })
                .lean();


        const companyIds =
            companies.map(
                (company) =>
                    company._id
            );


        /* ==================== JOB COUNTS ==================== */

        const jobCounts = new Map();


        if (companyIds.length > 0) {

            const jobAggregation =
                await Job.aggregate([
                    {
                        $match: {
                            company: {
                                $in: companyIds
                            }
                        }
                    },

                    {
                        $group: {
                            _id: "$company",

                            totalJobs: {
                                $sum: 1
                            },

                            activeJobs: {
                                $sum: {
                                    $cond: [
                                        {
                                            $eq: [
                                                "$status",
                                                "active"
                                            ]
                                        },
                                        1,
                                        0
                                    ]
                                }
                            },

                            draftJobs: {
                                $sum: {
                                    $cond: [
                                        {
                                            $eq: [
                                                "$status",
                                                "draft"
                                            ]
                                        },
                                        1,
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]);


            for (
                const item
                of jobAggregation
            ) {

                jobCounts.set(
                    String(item._id),
                    {
                        totalJobs:
                            item.totalJobs,

                        activeJobs:
                            item.activeJobs,

                        draftJobs:
                            item.draftJobs
                    }
                );
            }
        }


        /* ==================== ENRICH ==================== */

        const enrichedCompanies =
            companies.map(
                (company) => {

                    const stats =
                        jobCounts.get(
                            String(
                                company._id
                            )
                        ) || {
                            totalJobs: 0,
                            activeJobs: 0,
                            draftJobs: 0
                        };


                    return {
                        ...company,

                        totalJobs:
                            stats.totalJobs,

                        activeJobs:
                            stats.activeJobs,

                        draftJobs:
                            stats.draftJobs
                    };
                }
            );


        return res.status(200).json({
            success: true,

            companies:
                enrichedCompanies
        });

    } catch (error) {

        console.error(
            "Get companies error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch your companies."
        });
    }
};


/* =====================================================
   GET COMPANY BY ID
===================================================== */

export const getCompanyById = async (
    req,
    res
) => {
    try {

        const {
            companyId
        } = req.params;


        if (!isValidObjectId(companyId)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid company ID."
            });
        }


        const company =
            await Company.findById(
                companyId
            ).lean();


        if (!company) {
            return res.status(404).json({
                success: false,
                message:
                    "Company not found."
            });
        }


        return res.status(200).json({
            success: true,
            company
        });

    } catch (error) {

        console.error(
            "Get company by ID error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch company."
        });
    }
};


/* =====================================================
   UPDATE COMPANY
===================================================== */

export const updateCompany = async (
    req,
    res
) => {
    try {

        const {
            companyId
        } = req.params;


        if (!isValidObjectId(companyId)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid company ID."
            });
        }


        const company =
            await Company.findOne({
                _id: companyId,
                owner: req.userId
            });


        if (!company) {
            return res.status(404).json({
                success: false,
                message:
                    "Company not found or you do not own this company."
            });
        }


        const {
            name,
            description,
            website,
            location,
            logo
        } = req.body;


        /* ==================== NAME ==================== */

        if (
            name !== undefined
        ) {

            const normalizedName =
                normalizeText(name);


            if (!normalizedName) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company name cannot be empty."
                });
            }


            if (
                normalizedName.length < 2
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company name must contain at least 2 characters."
                });
            }


            const duplicate =
                await Company.findOne({
                    owner: req.userId,

                    _id: {
                        $ne:
                            company._id
                    },

                    name: {
                        $regex:
                            `^${normalizedName.replace(
                                /[.*+?^${}()|[\]\\]/g,
                                "\\$&"
                            )}$`,
                        $options: "i"
                    }
                });


            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message:
                        "You already have another company with this name."
                });
            }


            company.name =
                normalizedName;
        }


        /* ==================== OTHER FIELDS ==================== */

        if (
            description !== undefined
        ) {
            company.description =
                normalizeText(
                    description
                );
        }


        if (
            website !== undefined
        ) {
            company.website =
                normalizeText(
                    website
                );
        }


        if (
            location !== undefined
        ) {
            company.location =
                normalizeText(
                    location
                );
        }


        if (
            logo !== undefined
        ) {
            company.logo =
                normalizeText(
                    logo
                );
        }


        await company.save();


        return res.status(200).json({
            success: true,

            message:
                "Company updated successfully.",

            company
        });

    } catch (error) {

        console.error(
            "Update company error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to update company."
        });
    }
};


/* =====================================================
   GET COMPANY JOBS
===================================================== */

export const getCompanyJobs = async (
    req,
    res
) => {
    try {

        const {
            companyId
        } = req.params;


        if (!isValidObjectId(companyId)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid company ID."
            });
        }


        const company =
            await Company.findOne({
                _id: companyId,
                owner: req.userId
            });


        if (!company) {
            return res.status(404).json({
                success: false,
                message:
                    "Company not found or you do not own this company."
            });
        }


        const jobs =
            await Job.find({
                company: companyId,
                recruiter: req.userId
            })
                .sort({
                    createdAt: -1
                })
                .lean();


        return res.status(200).json({
            success: true,

            company,

            jobs
        });

    } catch (error) {

        console.error(
            "Get company jobs error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch company jobs."
        });
    }
};
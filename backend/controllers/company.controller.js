import { Company } from "../models/company.model.js";

export const createCompany = async (req, res) => {
    try {
        const {
            name,
            description,
            website,
            location,
            logo
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const existingCompany = await Company.findOne({
            name,
            owner: req.userId
        });

        if (existingCompany) {
            return res.status(400).json({
                message: "You already created this company.",
                success: false
            });
        }

        const company = await Company.create({
            name,
            description,
            website,
            location,
            logo,
            owner: req.userId
        });

        return res.status(201).json({
            message: "Company created successfully.",
            success: true,
            company
        });

    } catch (error) {
        console.error("Create company error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


export const getMyCompanies = async (req, res) => {
    try {
        const companies = await Company.find({
            owner: req.userId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            companies
        });

    } catch (error) {
        console.error("Get companies error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
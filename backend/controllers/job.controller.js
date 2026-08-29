import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";


export const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            skills,
            location,
            jobType,
            salaryMin,
            salaryMax,
            companyId
        } = req.body;


        /* ==================== VALIDATION ==================== */

        if (
            !title ||
            !description ||
            !location ||
            !jobType ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Required job fields are missing.",
                success: false
            });
        }


        /* ==================== CHECK COMPANY ==================== */

        const company = await Company.findOne({
            _id: companyId,
            owner: req.userId
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found or you do not own it.",
                success: false
            });
        }


        /* ==================== CREATE JOB ==================== */

        const job = await Job.create({
            title,
            description,
            requirements: requirements || [],
            skills: skills || [],
            location,
            jobType,
            salaryMin,
            salaryMax,
            company: company._id,
            recruiter: req.userId,
            status: "active",
            lastRecruiterActivity: new Date()
        });


        return res.status(201).json({
            message: "Job posted successfully.",
            success: true,
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: "active"
        })
            .populate("company", "name logo location")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            jobs
        });

    } catch (error) {
        console.error("Get jobs error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.userId
        })
            .populate("company", "name logo location")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            jobs
        });

    } catch (error) {
        console.error("Get my jobs error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
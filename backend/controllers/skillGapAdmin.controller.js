import { SkillGapResource } from "../models/skillGapResource.model.js";


// =====================================================
// CREATE SKILL GAP RESOURCE
// =====================================================

export const createSkillGapResource = async (req, res) => {
    try {

        const {
            skillName,
            title,
            description,
            resourceUrl,
            resourceType,
            cost,
            difficulty
        } = req.body;


        // Check required fields
        if (
            !skillName ||
            !title ||
            !description ||
            !resourceUrl ||
            !resourceType
        ) {
            return res.status(400).json({
                message: "Please provide all required fields.",
                success: false
            });
        }


        // Create resource
        const resource = await SkillGapResource.create({
            skillName: skillName.trim().toLowerCase(),
            title,
            description,
            resourceUrl,
            resourceType,
            cost: cost || "free",
            difficulty: difficulty || "beginner"
        });


        return res.status(201).json({
            message: "Skill gap resource created successfully.",
            success: true,
            resource
        });

    } catch (error) {

        console.error(
            "Create skill gap resource error:",
            error
        );


        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
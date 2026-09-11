import mongoose from "mongoose";

import { LearningResource } from "../models/learningResource.model.js";
import { LearningProgress } from "../models/learningProgress.model.js";


/* =====================================================
   HELPERS
===================================================== */

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


/* =====================================================
   GET LEARNING RESOURCES
===================================================== */

export const getLearningResources = async (
    req,
    res
) => {
    try {

        const {
            skill,
            difficulty,
            resourceType
        } = req.query;


        const filter = {
            isActive: true
        };


        /* ==================== SKILL FILTER ==================== */

        if (
            typeof skill === "string" &&
            skill.trim()
        ) {
            filter.skill = {
                $regex:
                    `^${skill.trim().replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    )}$`,
                $options: "i"
            };
        }


        /* ==================== DIFFICULTY ==================== */

        const allowedDifficulties = [
            "beginner",
            "intermediate",
            "advanced"
        ];


        if (
            difficulty &&
            allowedDifficulties.includes(
                difficulty
            )
        ) {
            filter.difficulty =
                difficulty;
        }


        /* ==================== TYPE ==================== */

        const allowedTypes = [
            "course",
            "documentation",
            "tutorial",
            "project",
            "practice",
            "video",
            "other"
        ];


        if (
            resourceType &&
            allowedTypes.includes(
                resourceType
            )
        ) {
            filter.resourceType =
                resourceType;
        }


        /* ==================== QUERY ==================== */

        const resources =
            await LearningResource.find(
                filter
            )
                .sort({
                    skill: 1,
                    difficulty: 1,
                    createdAt: -1
                })
                .lean();


        return res.status(200).json({
            success: true,

            count:
                resources.length,

            resources
        });

    } catch (error) {

        console.error(
            "Get learning resources error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch learning resources."
        });
    }
};


/* =====================================================
   GET SINGLE LEARNING RESOURCE
===================================================== */

export const getLearningResourceById = async (
    req,
    res
) => {
    try {

        const {
            resourceId
        } = req.params;


        if (
            !isValidObjectId(
                resourceId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid learning resource ID."
            });
        }


        const resource =
            await LearningResource.findOne({
                _id: resourceId,
                isActive: true
            })
                .lean();


        if (!resource) {
            return res.status(404).json({
                success: false,
                message:
                    "Learning resource not found."
            });
        }


        return res.status(200).json({
            success: true,
            resource
        });

    } catch (error) {

        console.error(
            "Get learning resource error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch learning resource."
        });
    }
};


/* =====================================================
   GET MY LEARNING PROGRESS
===================================================== */

export const getMyLearningProgress = async (
    req,
    res
) => {
    try {

        const progress =
            await LearningProgress.find({
                candidate:
                    req.userId
            })
                .populate(
                    "resource"
                )
                .sort({
                    updatedAt: -1
                });


        /* =================================================
           SUMMARY
        ================================================= */

        const total =
            progress.length;


        const completed =
            progress.filter(
                (item) =>
                    item.status ===
                    "completed"
            ).length;


        const inProgress =
            progress.filter(
                (item) =>
                    item.status ===
                    "in_progress"
            ).length;


        const notStarted =
            progress.filter(
                (item) =>
                    item.status ===
                    "not_started"
            ).length;


        const averageProgress =
            total === 0
                ? 0
                : Math.round(
                    progress.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            Number(
                                item.progressPercent ||
                                0
                            ),
                        0
                    ) /
                    total
                );


        const completionRate =
            total === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        total
                    ) * 100
                );


        return res.status(200).json({
            success: true,

            progress,

            summary: {
                total,
                completed,
                inProgress,
                notStarted,
                averageProgress,
                completionRate
            }
        });

    } catch (error) {

        console.error(
            "Get learning progress error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch your learning progress."
        });
    }
};


/* =====================================================
   GET MY PROGRESS FOR ONE RESOURCE
===================================================== */

export const getResourceProgress = async (
    req,
    res
) => {
    try {

        const {
            resourceId
        } = req.params;


        if (
            !isValidObjectId(
                resourceId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid learning resource ID."
            });
        }


        const resource =
            await LearningResource.findOne({
                _id: resourceId,
                isActive: true
            });


        if (!resource) {
            return res.status(404).json({
                success: false,
                message:
                    "Learning resource not found."
            });
        }


        const progress =
            await LearningProgress.findOne({
                candidate:
                    req.userId,

                resource:
                    resourceId
            })
                .populate(
                    "resource"
                );


        return res.status(200).json({
            success: true,

            progress:
                progress || {
                    candidate:
                        req.userId,

                    resource:
                        resourceId,

                    progressPercent:
                        0,

                    status:
                        "not_started",

                    startedAt:
                        null,

                    completedAt:
                        null
                }
        });

    } catch (error) {

        console.error(
            "Get resource progress error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch resource progress."
        });
    }
};


/* =====================================================
   UPDATE LEARNING PROGRESS
===================================================== */

export const updateLearningProgress = async (
    req,
    res
) => {
    try {

        const {
            resourceId,
            progressPercent
        } = req.body;


        /* ==================== VALIDATION ==================== */

        if (!resourceId) {
            return res.status(400).json({
                success: false,
                message:
                    "Resource ID is required."
            });
        }


        if (
            !isValidObjectId(
                resourceId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid resource ID."
            });
        }


        if (
            progressPercent ===
            undefined ||
            progressPercent ===
            null ||
            progressPercent === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Progress percentage is required."
            });
        }


        const numericProgress =
            Number(
                progressPercent
            );


        if (
            !Number.isFinite(
                numericProgress
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Progress must be a valid number."
            });
        }


        if (
            numericProgress < 0 ||
            numericProgress > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Progress must be between 0 and 100."
            });
        }


        const roundedProgress =
            Math.round(
                numericProgress
            );


        /* ==================== RESOURCE ==================== */

        const resource =
            await LearningResource.findOne({
                _id: resourceId,
                isActive: true
            });


        if (!resource) {
            return res.status(404).json({
                success: false,
                message:
                    "Learning resource not found."
            });
        }


        /* =================================================
           EXISTING PROGRESS
        ================================================= */

        const existingProgress =
            await LearningProgress.findOne({
                candidate:
                    req.userId,

                resource:
                    resourceId
            });


        /* =================================================
           DON'T ALLOW BACKWARD PROGRESS
        ================================================= */

        if (
            existingProgress &&
            roundedProgress <
            existingProgress.progressPercent
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Learning progress cannot be decreased."
            });
        }


        /* =================================================
           COMPLETED RESOURCE IS FINAL
        ================================================= */

        if (
            existingProgress &&
            existingProgress.status ===
            "completed"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This learning resource is already completed."
            });
        }


        /* =================================================
           STATUS
        ================================================= */

        let status =
            "not_started";


        if (
            roundedProgress > 0 &&
            roundedProgress < 100
        ) {
            status =
                "in_progress";
        }


        if (
            roundedProgress === 100
        ) {
            status =
                "completed";
        }


        const now =
            new Date();


        /* =================================================
           DATA
        ================================================= */

        const updateData = {
            progressPercent:
                roundedProgress,

            status
        };


        /*
         * Only set startedAt when the candidate
         * starts learning for the first time.
         */

        if (
            roundedProgress > 0 &&
            !existingProgress?.startedAt
        ) {
            updateData.startedAt =
                now;
        }


        if (
            roundedProgress === 100
        ) {
            updateData.completedAt =
                existingProgress?.completedAt ||
                now;
        }


        if (
            roundedProgress < 100 &&
            existingProgress?.completedAt
        ) {
            updateData.completedAt =
                null;
        }


        /* =================================================
           UPSERT
        ================================================= */

        const progress =
            await LearningProgress.findOneAndUpdate(
                {
                    candidate:
                        req.userId,

                    resource:
                        resourceId
                },
                {
                    $set:
                        updateData
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert:
                        true
                }
            )
                .populate(
                    "resource"
                );


        return res.status(200).json({
            success: true,

            message:
                status === "completed"
                    ? "Learning resource completed."
                    : status === "in_progress"
                        ? "Learning progress updated."
                        : "Learning progress saved.",

            progress
        });

    } catch (error) {

        console.error(
            "Update learning progress error:",
            error
        );


        /*
         * Unique index race-condition protection.
         */

        if (
            error?.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Learning progress already exists. Please try again."
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Unable to update learning progress."
        });
    }
};
import mongoose from "mongoose";

import { LearningResource } from "../models/learningResource.model.js";

/* =====================================================
   HELPERS
===================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeText = (value) => {
  return String(value || "").trim();
};

const normalizeSkill = (value) => {
  return normalizeText(value);
};

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/* =====================================================
   CREATE LEARNING RESOURCE
===================================================== */

export const createLearningResource = async (req, res) => {
  try {
    const {
      skill,
      title,
      description,
      resourceType,
      difficulty,
      durationMinutes,
      url,
      provider,
    } = req.body;

    const normalizedSkill = normalizeSkill(skill);

    const normalizedTitle = normalizeText(title);

    const normalizedDescription = normalizeText(description);

    const normalizedUrl = normalizeText(url);

    const normalizedProvider = normalizeText(provider);

    /* ==================== VALIDATION ==================== */

    if (!normalizedSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required.",
      });
    }

    if (!normalizedTitle) {
      return res.status(400).json({
        success: false,
        message: "Resource title is required.",
      });
    }

    if (normalizedTitle.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Resource title cannot exceed 150 characters.",
      });
    }

    if (normalizedDescription.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Resource description cannot exceed 1000 characters.",
      });
    }

    const allowedResourceTypes = [
      "course",
      "documentation",
      "tutorial",
      "project",
      "practice",
      "video",
      "other",
    ];

    if (resourceType && !allowedResourceTypes.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type.",
      });
    }

    const allowedDifficulties = ["beginner", "intermediate", "advanced"];

    if (difficulty && !allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty.",
      });
    }

    if (!normalizedUrl) {
      return res.status(400).json({
        success: false,
        message: "Resource URL is required.",
      });
    }

    if (!isValidHttpUrl(normalizedUrl)) {
      return res.status(400).json({
        success: false,
        message: "Resource URL must be a valid HTTP or HTTPS URL.",
      });
    }

    let normalizedDuration = 60;

    if (
      durationMinutes !== undefined &&
      durationMinutes !== null &&
      durationMinutes !== ""
    ) {
      normalizedDuration = Number(durationMinutes);

      if (!Number.isFinite(normalizedDuration) || normalizedDuration <= 0) {
        return res.status(400).json({
          success: false,
          message: "Duration must be a positive number.",
        });
      }

      normalizedDuration = Math.round(normalizedDuration);
    }

    /* =================================================
           DUPLICATE CHECK
        ================================================= */

    const existingResource = await LearningResource.findOne({
      skill: {
        $regex: `^${normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },

      title: {
        $regex: `^${normalizedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingResource) {
      return res.status(409).json({
        success: false,
        message:
          "A learning resource with this skill and title already exists.",
      });
    }

    /* =================================================
           CREATE
        ================================================= */

    const resource = await LearningResource.create({
      skill: normalizedSkill,

      title: normalizedTitle,

      description: normalizedDescription,

      resourceType: resourceType || "course",

      difficulty: difficulty || "intermediate",

      durationMinutes: normalizedDuration,

      url: normalizedUrl,

      provider: normalizedProvider,

      isActive: true,
    });

    return res.status(201).json({
      success: true,

      message: "Learning resource created successfully.",

      resource,
    });
  } catch (error) {
    console.error("Create learning resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create learning resource.",
    });
  }
};

/* =====================================================
   GET ALL LEARNING RESOURCES
===================================================== */

export const getAdminLearningResources = async (req, res) => {
  try {
    const { skill, isActive } = req.query;

    const filter = {};

    if (typeof skill === "string" && skill.trim()) {
      filter.skill = {
        $regex: `^${skill.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,

        $options: "i",
      };
    }

    if (isActive === "true") {
      filter.isActive = true;
    }

    if (isActive === "false") {
      filter.isActive = false;
    }

    const resources = await LearningResource.find(filter)
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,

      count: resources.length,

      resources,
    });
  } catch (error) {
    console.error("Get admin learning resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch learning resources.",
    });
  }
};

/* =====================================================
   UPDATE LEARNING RESOURCE
===================================================== */

export const updateLearningResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learning resource ID.",
      });
    }

    const resource = await LearningResource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found.",
      });
    }

    const {
      skill,
      title,
      description,
      resourceType,
      difficulty,
      durationMinutes,
      url,
      provider,
      isActive,
    } = req.body;

    /* ==================== SKILL ==================== */

    if (skill !== undefined) {
      const value = normalizeSkill(skill);

      if (!value) {
        return res.status(400).json({
          success: false,
          message: "Skill cannot be empty.",
        });
      }

      resource.skill = value;
    }

    /* ==================== TITLE ==================== */

    if (title !== undefined) {
      const value = normalizeText(title);

      if (!value) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty.",
        });
      }

      resource.title = value;
    }

    /* ==================== DESCRIPTION ==================== */

    if (description !== undefined) {
      const value = normalizeText(description);

      if (value.length > 1000) {
        return res.status(400).json({
          success: false,
          message: "Description cannot exceed 1000 characters.",
        });
      }

      resource.description = value;
    }

    /* ==================== TYPE ==================== */

    if (resourceType !== undefined) {
      const allowedResourceTypes = [
        "course",
        "documentation",
        "tutorial",
        "project",
        "practice",
        "video",
        "other",
      ];

      if (!allowedResourceTypes.includes(resourceType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource type.",
        });
      }

      resource.resourceType = resourceType;
    }

    /* ==================== DIFFICULTY ==================== */

    if (difficulty !== undefined) {
      const allowedDifficulties = ["beginner", "intermediate", "advanced"];

      if (!allowedDifficulties.includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: "Invalid difficulty.",
        });
      }

      resource.difficulty = difficulty;
    }

    /* ==================== DURATION ==================== */

    if (durationMinutes !== undefined) {
      const duration = Number(durationMinutes);

      if (!Number.isFinite(duration) || duration <= 0) {
        return res.status(400).json({
          success: false,
          message: "Duration must be a positive number.",
        });
      }

      resource.durationMinutes = Math.round(duration);
    }

    /* ==================== URL ==================== */

    if (url !== undefined) {
      const normalizedUrl = normalizeText(url);

      if (!isValidHttpUrl(normalizedUrl)) {
        return res.status(400).json({
          success: false,
          message: "Resource URL must be a valid HTTP or HTTPS URL.",
        });
      }

      resource.url = normalizedUrl;
    }

    /* ==================== PROVIDER ==================== */

    if (provider !== undefined) {
      resource.provider = normalizeText(provider);
    }

    /* ==================== ACTIVE ==================== */

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false.",
        });
      }

      resource.isActive = isActive;
    }

    await resource.save();

    return res.status(200).json({
      success: true,

      message: "Learning resource updated successfully.",

      resource,
    });
  } catch (error) {
    console.error("Update learning resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update learning resource.",
    });
  }
};

/* =====================================================
   DEACTIVATE LEARNING RESOURCE
===================================================== */

export const deactivateLearningResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learning resource ID.",
      });
    }

    const resource = await LearningResource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found.",
      });
    }

    resource.isActive = false;

    await resource.save();

    return res.status(200).json({
      success: true,

      message: "Learning resource deactivated successfully.",

      resource,
    });
  } catch (error) {
    console.error("Deactivate learning resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to deactivate learning resource.",
    });
  }
};

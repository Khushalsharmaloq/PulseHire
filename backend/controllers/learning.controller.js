import { LearningResource } from "../models/learningResource.model.js";
import { LearningProgress } from "../models/learningProgress.model.js";


// =====================================================
// GET LEARNING RESOURCES
// =====================================================

export const getLearningResources = async (req, res) => {
  try {
    const skill = String(req.query.skill || "")
      .trim();

    const filter = {
      isActive: true,
    };

    if (skill) {
      filter.skill = {
        $regex: `^${skill}$`,
        $options: "i",
      };
    }

    const resources = await LearningResource.find(filter)
      .sort({
        skill: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error(
      "Get learning resources error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch learning resources.",
    });
  }
};


// =====================================================
// GET MY LEARNING PROGRESS
// =====================================================

export const getMyLearningProgress = async (
  req,
  res
) => {
  try {
    const progress = await LearningProgress.find({
      candidate: req.userId,
    })
      .populate("resource")
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "Get learning progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your learning progress.",
    });
  }
};


// =====================================================
// START / UPDATE LEARNING PROGRESS
// =====================================================

export const updateLearningProgress = async (
  req,
  res
) => {
  try {
    const {
      resourceId,
      progressPercent,
    } = req.body;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "Resource ID is required.",
      });
    }

    const numericProgress =
      Number(progressPercent);

    if (
      Number.isNaN(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100.",
      });
    }

    const resource =
      await LearningResource.findById(
        resourceId
      );

    if (!resource || !resource.isActive) {
      return res.status(404).json({
        success: false,
        message:
          "Learning resource not found.",
      });
    }

    let status = "in_progress";

    if (numericProgress === 0) {
      status = "not_started";
    }

    if (numericProgress === 100) {
      status = "completed";
    }

    const updateData = {
      progressPercent: numericProgress,
      status,
    };

    if (numericProgress > 0) {
      updateData.startedAt = new Date();
    }

    if (numericProgress === 100) {
      updateData.completedAt = new Date();
    }

    const progress =
      await LearningProgress.findOneAndUpdate(
        {
          candidate: req.userId,
          resource: resourceId,
        },
        {
          $set: updateData,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      ).populate("resource");

    return res.status(200).json({
      success: true,
      message:
        numericProgress === 100
          ? "Learning resource completed."
          : "Learning progress updated.",
      progress,
    });
  } catch (error) {
    console.error(
      "Update learning progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update learning progress.",
    });
  }
};
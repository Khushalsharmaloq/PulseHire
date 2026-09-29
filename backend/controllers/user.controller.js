import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import {
  createPrivateResumeDownloadUrl,
  destroyCloudinaryAsset,
  uploadPrivateResumeToCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.util.js";
import { getAuthCookieOptions } from "../utils/authCookie.util.js";
import { parsePositiveInteger } from "../utils/request.util.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const getPublicUser = (user) => {
  const recruiterVerificationStatus =
    user.role === "recruiter"
      ? user.recruiterVerification?.status || "pending"
      : "not_required";

  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    recruiterVerificationStatus,
    recruiterVerification:
      user.role === "recruiter"
        ? {
            status: recruiterVerificationStatus,
            note: user.recruiterVerification?.note || "",
            reviewedAt: user.recruiterVerification?.reviewedAt || null,
          }
        : undefined,
  };
};

const getResumeRedirect = (user) => {
  const profile = user?.profile;

  if (profile?.resumePublicId) {
    return createPrivateResumeDownloadUrl({
      publicId: profile.resumePublicId,
      format: profile.resumeFormat || "pdf",
      resourceType: profile.resumeResourceType || "raw",
      deliveryType: profile.resumeDeliveryType || "authenticated",
    });
  }

  // Backward compatibility for resumes uploaded before private storage was added.
  if (/^https?:\/\//i.test(profile?.resume || "")) {
    return profile.resume;
  }

  return null;
};

/* =====================================================
   REGISTER
===================================================== */

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    const normalizedFullname = String(fullname || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phoneNumber || "").trim();

    if (
      !normalizedFullname ||
      !normalizedEmail ||
      !normalizedPhone ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
        success: false,
      });
    }

    if (String(password).length < 8 || String(password).length > 128) {
      return res.status(400).json({
        message: "Password must be between 8 and 128 characters.",
        success: false,
      });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    if (!phoneRegex.test(normalizedPhone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullname: normalizedFullname,
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      password: hashedPassword,
      role,
      recruiterVerification: {
        status: role === "recruiter" ? "pending" : "not_required",
      },
    });

    return res.status(201).json({
      message:
        role === "recruiter"
          ? "Account created. Recruiter verification is pending."
          : "Account created successfully.",
      success: true,
      user: getPublicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

/* =====================================================
   LOGIN
===================================================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        message: "This account has been suspended.",
        success: false,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        message: "Authentication service is not configured.",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, getAuthCookieOptions())
      .json({
        message: `Welcome back, ${user.fullname}.`,
        success: true,
        user: getPublicUser(user),
      });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

/* =====================================================
   LOGOUT
===================================================== */

export const logout = async (req, res) => {
  try {
    const cookieOptions = getAuthCookieOptions();

    return res
      .status(200)
      .cookie("token", "", {
        ...cookieOptions,
        maxAge: 0,
        expires: new Date(0),
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

/* =====================================================
   GET CURRENT USER
===================================================== */

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

/* =====================================================
   UPDATE PROFILE
===================================================== */

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const normalizedFullname = String(fullname || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhoneNumber = String(phoneNumber || "").trim();

    if (!normalizedFullname || normalizedFullname.length < 2) {
      return res.status(400).json({
        message: "Full name must contain at least 2 characters.",
        success: false,
      });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    if (!phoneRegex.test(normalizedPhoneNumber)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits.",
        success: false,
      });
    }

    if (bio !== undefined && String(bio).length > 2000) {
      return res.status(400).json({
        message: "Bio cannot exceed 2000 characters.",
        success: false,
      });
    }

    if (skills !== undefined && !Array.isArray(skills)) {
      return res.status(400).json({
        message: "Skills must be an array.",
        success: false,
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const recruiterEmailChanged =
      user.role === "recruiter" && normalizedEmail !== user.email;

    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "This email is already registered.",
          success: false,
        });
      }
    }

    user.fullname = normalizedFullname;
    user.email = normalizedEmail;
    user.phoneNumber = normalizedPhoneNumber;

    if (recruiterEmailChanged) {
      user.recruiterVerification.status = "pending";
      user.recruiterVerification.reviewedBy = null;
      user.recruiterVerification.reviewedAt = null;
      user.recruiterVerification.note =
        "Email changed. Recruiter identity must be verified again.";
    }

    if (bio !== undefined) {
      user.profile.bio = String(bio).trim();
    }

    if (skills !== undefined) {
      user.profile.skills = [
        ...new Set(skills.map((skill) => String(skill).trim()).filter(Boolean)),
      ].slice(0, 100);
    }

    await user.save();

    if (recruiterEmailChanged) {
      await Job.updateMany(
        { recruiter: user._id, status: "active" },
        {
          $set: {
            status: "paused",
            lastRecruiterActivity: new Date(),
          },
        },
      );
    }

    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

/* =====================================================
   ROLE TESTS
===================================================== */

export const recruiterTest = async (req, res) =>
  res.status(200).json({
    message: "Recruiter authorization successful.",
    success: true,
    userId: req.userId,
    role: req.userRole,
  });

export const candidateTest = async (req, res) =>
  res.status(200).json({
    message: "Candidate authorization successful.",
    success: true,
    userId: req.userId,
    role: req.userRole,
  });

/* =====================================================
   UPLOAD PROFILE PHOTO
===================================================== */

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const user = await User.findById(req.userId).select(
      "+profile.profilePhotoPublicId",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const previousPublicId = user.profile?.profilePhotoPublicId;
    const result = await uploadToCloudinary(
      req.file.buffer,
      "pulsehire/profile-photos",
    );

    user.profile.profilePhoto = result.secure_url;
    user.profile.profilePhotoPublicId = result.public_id;
    await user.save();

    if (previousPublicId && previousPublicId !== result.public_id) {
      destroyCloudinaryAsset({ publicId: previousPublicId }).catch((error) => {
        console.error("Old profile photo cleanup failed:", error.message);
      });
    }

    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload profile photo.",
    });
  }
};

/* =====================================================
   UPLOAD PRIVATE RESUME
===================================================== */

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Backend did not receive the resume file.",
      });
    }

    const user = await User.findById(req.userId).select(
      "+profile.resumePublicId +profile.resumeResourceType +profile.resumeDeliveryType +profile.resumeFormat",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const previousAsset = user.profile?.resumePublicId
      ? {
          publicId: user.profile.resumePublicId,
          resourceType: user.profile.resumeResourceType || "raw",
          deliveryType: user.profile.resumeDeliveryType || "authenticated",
        }
      : null;

    const result = await uploadPrivateResumeToCloudinary(
      req.file.buffer,
      "pulsehire/resumes",
    );

    // "private" is intentionally only a presence marker for older UI code.
    // The actual Cloudinary identifier is select:false and never sent to clients.
    user.profile.resume = "private";
    user.profile.resumeOriginalName = req.file.originalname;
    user.profile.resumePublicId = result.public_id;
    user.profile.resumeResourceType = result.resource_type || "raw";
    user.profile.resumeDeliveryType = result.type || "authenticated";
    user.profile.resumeFormat = result.format || "pdf";

    await user.save();

    if (previousAsset && previousAsset.publicId !== result.public_id) {
      destroyCloudinaryAsset(previousAsset).catch((error) => {
        console.error("Old resume cleanup failed:", error.message);
      });
    }

    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded securely.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload resume.",
    });
  }
};

/* =====================================================
   DOWNLOAD OWN RESUME
===================================================== */

export const downloadOwnResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "+profile.resumePublicId +profile.resumeResourceType +profile.resumeDeliveryType +profile.resumeFormat",
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const downloadUrl = getResumeRedirect(user);

    if (!downloadUrl) {
      return res.status(404).json({
        success: false,
        message: "No resume has been uploaded.",
      });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.redirect(302, downloadUrl);
  } catch (error) {
    console.error("Resume download error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to open resume.",
    });
  }
};

/* =====================================================
   ADMIN — LIST RECRUITERS
===================================================== */

export const getRecruitersForAdmin = async (req, res) => {
  try {
    const allowedStatuses = ["pending", "verified", "rejected"];
    const requestedStatus = String(req.query.status || "pending").trim();

    if (!allowedStatuses.includes(requestedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter verification status.",
      });
    }

    const page = parsePositiveInteger(req.query.page, {
      defaultValue: 1,
      min: 1,
    });
    const limit = parsePositiveInteger(req.query.limit, {
      defaultValue: 25,
      min: 1,
      max: 100,
    });
    const filter = {
      role: "recruiter",
      ...(requestedStatus === "pending"
        ? {
            $or: [
              { "recruiterVerification.status": "pending" },
              { "recruiterVerification.status": { $exists: false } },
            ],
          }
        : { "recruiterVerification.status": requestedStatus }),
    };

    const [recruiters, total] = await Promise.all([
      User.find(filter)
        .select(
          "fullname email phoneNumber accountStatus recruiterVerification createdAt",
        )
        .populate("recruiterVerification.reviewedBy", "fullname email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const recruiterIds = recruiters.map((recruiter) => recruiter._id);
    const companies =
      recruiterIds.length === 0
        ? []
        : await Company.find({ owner: { $in: recruiterIds } })
            .select("name description website location logo owner createdAt")
            .sort({ createdAt: -1 })
            .lean();

    const companiesByOwner = new Map();

    for (const company of companies) {
      const ownerId = String(company.owner);

      if (!companiesByOwner.has(ownerId)) {
        companiesByOwner.set(ownerId, []);
      }

      companiesByOwner.get(ownerId).push(company);
    }

    const recruiterQueue = recruiters.map((recruiter) => ({
      ...recruiter,
      companies: companiesByOwner.get(String(recruiter._id)) || [],
    }));

    return res.status(200).json({
      success: true,
      recruiters: recruiterQueue,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("Admin recruiter list error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch recruiter verification queue.",
    });
  }
};

/* =====================================================
   ADMIN — REVIEW RECRUITER
===================================================== */

export const reviewRecruiterVerification = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { status, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be verified or rejected.",
      });
    }

    const normalizedNote = String(note || "").trim();

    if (normalizedNote.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Verification note cannot exceed 500 characters.",
      });
    }

    if (status === "rejected" && !normalizedNote) {
      return res.status(400).json({
        success: false,
        message: "A reason is required when rejecting recruiter verification.",
      });
    }

    const recruiter = await User.findOne({
      _id: recruiterId,
      role: "recruiter",
    });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter account not found.",
      });
    }

    if (status === "verified") {
      const companyExists = await Company.exists({ owner: recruiter._id });

      if (!companyExists) {
        return res.status(409).json({
          success: false,
          message:
            "The recruiter must create a company profile before verification can be approved.",
        });
      }
    }

    recruiter.recruiterVerification.status = status;
    recruiter.recruiterVerification.reviewedBy = req.userId;
    recruiter.recruiterVerification.reviewedAt = new Date();
    recruiter.recruiterVerification.note = normalizedNote;

    await recruiter.save();

    if (status === "rejected") {
      await Job.updateMany(
        { recruiter: recruiter._id, status: "active" },
        {
          $set: {
            status: "paused",
            lastRecruiterActivity: new Date(),
          },
        },
      );
    }

    const updatedRecruiter = await User.findById(recruiter._id)
      .select(
        "fullname email phoneNumber accountStatus recruiterVerification createdAt",
      )
      .populate("recruiterVerification.reviewedBy", "fullname email");

    return res.status(200).json({
      success: true,
      message:
        status === "verified"
          ? "Recruiter verified successfully."
          : "Recruiter verification rejected.",
      recruiter: updatedRecruiter,
    });
  } catch (error) {
    console.error("Admin recruiter review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to review recruiter verification.",
    });
  }
};

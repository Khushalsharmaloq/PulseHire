import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import { User } from "../models/user.model.js";

/* =====================================================
   REGISTER
===================================================== */

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullname || !email || !phoneNumber || !password || !role) {
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

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
        success: false,
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits.",
        success: false,
      });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
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

    const normalizedEmail = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

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

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        message: "Authentication service is not configured.",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back, ${user.fullname}.`,
        success: true,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
        },
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
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
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
    const user = await User.findById(req.userId).select("-password");

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
    const {
      fullname,
      email,
      phoneNumber,
      bio,
      skills,
      resume,
      resumeOriginalName,
      profilePhoto,
    } = req.body;

    const normalizedFullname = fullname?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhoneNumber = phoneNumber?.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!normalizedFullname) {
      return res.status(400).json({
        message: "Full name is required.",
        success: false,
      });
    }

    if (normalizedFullname.length < 2) {
      return res.status(400).json({
        message: "Full name must contain at least 2 characters.",
        success: false,
      });
    }

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    if (!normalizedPhoneNumber || !phoneRegex.test(normalizedPhoneNumber)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits.",
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

    /* ===============================================
       BASIC USER INFORMATION
    =============================================== */

    if (fullname !== undefined) {
      user.fullname = normalizedFullname;
    }

    if (email !== undefined && email.trim() !== "") {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

        if (existingUser) {
          return res.status(400).json({
            message: "This email is already registered.",
            success: false,
          });
        }

        user.email = normalizedEmail;
      }
    }

    if (phoneNumber !== undefined) {
      user.phoneNumber = normalizedPhoneNumber;
    }

    /* ===============================================
       PROFILE INFORMATION
    =============================================== */

    if (bio !== undefined) {
      user.profile.bio = bio.trim();
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          message: "Skills must be an array.",
          success: false,
        });
      }

      user.profile.skills = [
        ...new Set(skills.map((skill) => String(skill).trim()).filter(Boolean)),
      ];
    }

    if (resume !== undefined) {
      user.profile.resume = resume;
    }

    if (resumeOriginalName !== undefined) {
      user.profile.resumeOriginalName = resumeOriginalName;
    }

    if (profilePhoto !== undefined) {
      user.profile.profilePhoto = profilePhoto;
    }

    await user.save();

    /* ===============================================
       RETURN UPDATED USER
    =============================================== */

    const updatedUser = await User.findById(user._id).select("-password");

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
   RECRUITER TEST
===================================================== */

export const recruiterTest = async (req, res) => {
  return res.status(200).json({
    message: "Recruiter authorization successful.",
    success: true,
    userId: req.userId,
    role: req.userRole,
  });
};

/* =====================================================
   CANDIDATE TEST
===================================================== */

export const candidateTest = async (req, res) => {
  return res.status(200).json({
    message: "Candidate authorization successful.",
    success: true,
    userId: req.userId,
    role: req.userRole,
  });
};

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

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "pulsehire/profile-photos",
    );

    user.profile.profilePhoto = result.secure_url;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

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
    UPLOAD RESUME   
===================================================== */
export const uploadResume = async (req, res) => {
  try {
    console.log("========== RESUME UPLOAD ==========");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Backend did not receive the resume file.",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "pulsehire/resumes",
    );

    user.profile.resume = result.secure_url.endsWith(".pdf")
      ? result.secure_url
      : `${result.secure_url}.pdf`;
    user.profile.resumeOriginalName = req.file.originalname;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
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

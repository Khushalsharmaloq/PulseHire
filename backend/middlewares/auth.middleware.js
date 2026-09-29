import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated.",
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
        success: false,
      });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        message: "This account has been suspended.",
        success: false,
      });
    }

    req.userId = user._id;
    req.userRole = user.role;
    req.user = user;

    next();
  } catch (error) {
    if (error?.name !== "JsonWebTokenError" && error?.name !== "TokenExpiredError") {
      console.error("Authentication error:", error.message);
    }

    return res.status(401).json({
      message: "Invalid or expired token.",
      success: false,
    });
  }
};

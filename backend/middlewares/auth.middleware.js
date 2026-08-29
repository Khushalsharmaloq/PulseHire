import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists.",
                success: false
            });
        }

        req.userId = user._id;
        req.userRole = user.role;

        next();

    } catch (error) {
        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token.",
            success: false
        });
    }
};
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userId) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        if (!req.userRole) {
            return res.status(403).json({
                message: "User role not available.",
                success: false
            });
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                message: "You are not authorized to perform this action.",
                success: false
            });
        }

        next();
    };
};
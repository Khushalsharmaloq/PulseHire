import multer from "multer";


/*
|--------------------------------------------------------------------------
| NOT FOUND HANDLER
|--------------------------------------------------------------------------
*/

export const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};


/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

export const errorHandler = (error, req, res, next) => {
    console.error(
        "Global error:",
        error
    );


    /* =====================================================
       MULTER ERRORS
    ===================================================== */

    if (error instanceof multer.MulterError) {

        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message:
                    "Uploaded file is too large."
            });
        }


        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message:
                    `Unexpected file field "${error.field || "unknown"}".`
            });
        }


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "File upload failed."
        });
    }


    /* =====================================================
       CUSTOM FILE FILTER ERROR
    ===================================================== */

    if (
        error?.message ===
        "Only PDF resume files are allowed."
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Only PDF resume files are allowed."
        });
    }


    if (
        error?.message ===
        "Only image files are allowed."
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Only image files are allowed."
        });
    }


    /* =====================================================
       INVALID JSON
    ===================================================== */

    if (
        error?.type ===
        "entity.parse.failed"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid JSON request body."
        });
    }


    /* =====================================================
       PAYLOAD TOO LARGE
    ===================================================== */

    if (
        error?.type ===
        "entity.too.large"
    ) {
        return res.status(413).json({
            success: false,
            message:
                "Request payload is too large."
        });
    }


    /* =====================================================
       MONGOOSE VALIDATION ERROR
    ===================================================== */

    if (
        error?.name ===
        "ValidationError"
    ) {
        const validationErrors =
            Object.values(
                error.errors || {}
            ).map(
                (item) => item.message
            );


        return res.status(400).json({
            success: false,
            message:
                "Validation failed.",
            errors:
                validationErrors
        });
    }


    /* =====================================================
       MONGOOSE CAST ERROR
    ===================================================== */

    if (
        error?.name ===
        "CastError"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid resource ID."
        });
    }


    /* =====================================================
       DUPLICATE KEY
    ===================================================== */

    if (
        error?.code === 11000
    ) {
        return res.status(409).json({
            success: false,
            message:
                "A record with the same unique value already exists."
        });
    }


    /* =====================================================
       DEFAULT ERROR
    ===================================================== */

    return res.status(
        error?.statusCode || 500
    ).json({
        success: false,
        message:
            error?.statusCode
                ? error.message
                : "Internal server error."
    });
};
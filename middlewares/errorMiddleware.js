import multer from "multer";

export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            success: false,
            message: "Unexpected upload field. Use 'attachment' or 'file' for task uploads",
        });
    }

    const status = err.status || 500;
    console.error("Error:", err.message);

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

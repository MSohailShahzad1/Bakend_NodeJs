import multer from "multer";
import fs from "fs";
import path from "path";

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const profileStorage = multer.diskStorage({
    destination: function destination(req, file, cb) {
        const dir = "uploads/profiles";
        ensureDir(dir);
        cb(null, dir);
    },
    filename: function filename(req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const taskStorage = multer.diskStorage({
    destination: function destination(req, file, cb) {
        const dir = "uploads/tasks";
        ensureDir(dir);
        cb(null, dir);
    },
    filename: function filename(req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

export const profileImageUpload = multer({
    storage: profileStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});

export const taskAttachmentUpload = multer({
    storage: taskStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

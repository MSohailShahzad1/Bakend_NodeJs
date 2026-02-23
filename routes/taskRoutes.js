import express from "express";
import {
    createTask,
    deleteTask,
    downloadTaskAttachment,
    getTaskById,
    getTasks,
    updateTask,
    updateTaskStatus,
    uploadTaskAttachment,
} from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { taskAttachmentUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTask);
router.get("/", authenticate, getTasks);
router.get("/:id", authenticate, getTaskById);
router.put("/:id", authenticate, updateTask);
router.patch("/:id/status", authenticate, updateTaskStatus);
router.patch(
    "/:id/attachment",
    authenticate,
    taskAttachmentUpload.fields([
        { name: "attachment", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    uploadTaskAttachment
);
router.get("/:id/attachment/download", authenticate, downloadTaskAttachment);
router.delete("/:id", authenticate, isAdmin, deleteTask);

export default router;

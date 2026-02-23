import fs from "fs";
import * as taskService from "../services/taskServices.js";

export const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json({
            success: true,
            message: "Task assigned successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasks();
        res.status(200).json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req, res, next) => {
    try {
        const task = await taskService.updateTaskStatus(req.params.id, req.body.status);
        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const uploadTaskAttachment = async (req, res, next) => {
    try {
        const attachmentFile =
            req.files?.attachment?.[0] || req.files?.file?.[0] || null;

        if (!attachmentFile) {
            return res.status(400).json({
                success: false,
                message: "No attachment uploaded. Use multipart field 'attachment' or 'file'",
            });
        }

        const attachment = `/uploads/tasks/${attachmentFile.filename}`;
        const task = await taskService.uploadTaskAttachment(req.params.id, attachment);

        return res.status(200).json({
            success: true,
            message: "Task attachment uploaded successfully",
            data: task,
        });
    } catch (error) {
        return next(error);
    }
};

export const downloadTaskAttachment = async (req, res, next) => {
    try {
        const { absolutePath, fileName } = await taskService.getTaskAttachmentStreamData(
            req.params.id
        );

        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        const stream = fs.createReadStream(absolutePath);
        stream.on("error", next);
        stream.pipe(res);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

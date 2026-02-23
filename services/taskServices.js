import fs from "fs";
import path from "path";
import prisma from "../lib/prisma.js";
import { createHttpError } from "../utils/httpError.js";

const parseId = (value, fieldName) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        throw createHttpError(400, `Invalid ${fieldName}`);
    }
    return parsed;
};

const allowedStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];

const getTaskOrThrow = async (id) => {
    const task = await prisma.task.findUnique({
        where: { id },
        include: {
            intern: true,
        },
    });

    if (!task) {
        throw createHttpError(404, "Task not found");
    }
    return task;
};

export const createTask = async (payload) => {
    const { title, description, internId } = payload;

    if (!title || !description || !internId) {
        throw createHttpError(400, "Title, description and internId are required");
    }

    const parsedInternId = parseId(internId, "intern id");

    const intern = await prisma.intern.findUnique({
        where: { id: parsedInternId },
    });
    if (!intern) {
        throw createHttpError(404, "Intern not found");
    }

    return prisma.task.create({
        data: {
            title,
            description,
            internId: parsedInternId,
        },
    });
};

export const getTasks = () =>
    prisma.task.findMany({
        include: {
            intern: true,
        },
        orderBy: { createdAt: "desc" },
    });

export const getTaskById = async (rawTaskId) => {
    const id = parseId(rawTaskId, "task id");
    return getTaskOrThrow(id);
};

export const updateTask = async (rawTaskId, payload) => {
    const id = parseId(rawTaskId, "task id");
    const { title, description, internId } = payload;

    await getTaskOrThrow(id);

    let parsedInternId;
    if (internId !== undefined) {
        parsedInternId = parseId(internId, "intern id");
        const intern = await prisma.intern.findUnique({
            where: { id: parsedInternId },
        });
        if (!intern) {
            throw createHttpError(404, "Intern not found");
        }
    }

    return prisma.task.update({
        where: { id },
        data: {
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            ...(parsedInternId ? { internId: parsedInternId } : {}),
        },
    });
};

export const updateTaskStatus = async (rawTaskId, status) => {
    const id = parseId(rawTaskId, "task id");
    await getTaskOrThrow(id);

    if (!allowedStatuses.includes(status)) {
        throw createHttpError(
            400,
            "Invalid status. Use one of: PENDING, IN_PROGRESS, COMPLETED"
        );
    }

    return prisma.task.update({
        where: { id },
        data: { status },
    });
};

export const uploadTaskAttachment = async (rawTaskId, attachmentPath) => {
    const id = parseId(rawTaskId, "task id");
    await getTaskOrThrow(id);

    return prisma.task.update({
        where: { id },
        data: { attachment: attachmentPath },
    });
};

export const getTaskAttachmentStreamData = async (rawTaskId) => {
    const id = parseId(rawTaskId, "task id");
    const task = await getTaskOrThrow(id);

    if (!task.attachment) {
        throw createHttpError(404, "This task has no attachment");
    }

    const relativePath = task.attachment.replace(/^\/+/, "");
    const absolutePath = path.resolve(process.cwd(), relativePath);

    if (!absolutePath.startsWith(path.resolve(process.cwd(), "uploads"))) {
        throw createHttpError(400, "Invalid attachment path");
    }

    if (!fs.existsSync(absolutePath)) {
        throw createHttpError(404, "Attachment file does not exist");
    }

    return {
        absolutePath,
        fileName: path.basename(absolutePath),
    };
};

export const deleteTask = async (rawTaskId) => {
    const id = parseId(rawTaskId, "task id");
    await getTaskOrThrow(id);

    await prisma.task.delete({
        where: { id },
    });
};

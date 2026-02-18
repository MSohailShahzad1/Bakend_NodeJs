import prisma from "../lib/prisma.js";

const ALLOWED_ROLES = ["USER", "ADMIN"];

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const createUser = async (payload = {}) => {
    const { name, email, role = "USER" } = payload;

    if (!name || !email) {
        throw createHttpError(400, "Name and email are required");
    }

    const normalizedRole = String(role).trim().toUpperCase();
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
        throw createHttpError(400, "Role must be USER or ADMIN");
    }

    return prisma.user.create({
        data: {
            name,
            email,
            role: normalizedRole,
        },
    });
};

export const getUsers = async () => {
    return prisma.user.findMany();
};

export const getUserById = async (rawId) => {
    const id = Number.parseInt(rawId, 10);

    if (Number.isNaN(id)) {
        throw createHttpError(400, "Invalid user ID");
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw createHttpError(404, "User not found");
    }

    return user;
};

export const deleteUser = async (rawId) => {
    const id = Number.parseInt(rawId, 10);

    if (Number.isNaN(id)) {
        throw createHttpError(400, "Invalid user ID");
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw createHttpError(404, "User not found");
    }

    await prisma.user.delete({
        where: { id },
    });
};

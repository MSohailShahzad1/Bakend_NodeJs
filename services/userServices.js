import prisma from "../lib/prisma.js";

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const updateProfileImageService = async (userId, imagePath) => {
    const id = Number.parseInt(userId, 10)
    return await prisma.user.update({
        where: { id: id },
        data: { profileImage: imagePath },
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

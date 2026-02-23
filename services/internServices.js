import prisma from "../lib/prisma.js";
import { createHttpError } from "../utils/httpError.js";

const parseId = (value, fieldName) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        throw createHttpError(400, `Invalid ${fieldName}`);
    }
    return parsed;
};

export const createIntern = async (payload, userId) => {
    const { name, email } = payload;

    if (!name || !email) {
        throw createHttpError(400, "Name and email are required");
    }

    const existingIntern = await prisma.intern.findUnique({
        where: { email },
    });

    if (existingIntern) {
        throw createHttpError(409, "Intern with this email already exists");
    }

    return prisma.intern.create({
        data: {
            name,
            email,
            userId,
        },
    });
};

export const getInterns = () =>
    prisma.intern.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
            tasks: true,
        },
        orderBy: { createdAt: "desc" },
    });

export const getInternById = async (rawInternId) => {
    const id = parseId(rawInternId, "intern id");

    const intern = await prisma.intern.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
            tasks: true,
        },
    });

    if (!intern) {
        throw createHttpError(404, "Intern not found");
    }

    return intern;
};

export const updateIntern = async (rawInternId, payload) => {
    const id = parseId(rawInternId, "intern id");
    const { name, email } = payload;

    await getInternById(id);

    return prisma.intern.update({
        where: { id },
        data: {
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
        },
    });
};

export const updateInternProfileImage = async (rawInternId, profileImg) => {
    const id = parseId(rawInternId, "intern id");
    await getInternById(id);

    return prisma.intern.update({
        where: { id },
        data: { profileImg },
    });
};

export const deleteIntern = async (rawInternId) => {
    const id = parseId(rawInternId, "intern id");
    await getInternById(id);

    await prisma.intern.delete({
        where: { id },
    });
};

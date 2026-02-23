import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { createHttpError } from "../utils/httpError.js";
import { generateToken } from "../utils/jwt.js";

const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
});

export const registerUser = async (payload = {}) => {
    const { name, email, password } = payload;

    if (!name || !email || !password) {
        throw createHttpError(400, "Name, email and password are required");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw createHttpError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "USER",
        },
    });

    return sanitizeUser(createdUser);
};

export const loginUser = async (payload = {}) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw createHttpError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw createHttpError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, "Invalid credentials");
    }

    const cleanUser = sanitizeUser(user);
    const token = generateToken(cleanUser);

    return { user: cleanUser, token };
};

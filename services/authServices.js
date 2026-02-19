import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js";

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const registerUser = async (payload = {}) => {
    const { name, email, password } = payload;
    if (!name || !email || !password) {
        throw createHttpError(400, "Name, email, and password are required");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });
    if (existingUser) {
        throw createHttpError(409, "User with email already exists");
    }

    // Hash password
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);

    // Get the USER role from database
    const userRole = await prisma.role.findUnique({
        where: { name: "USER" }
    });

    if (!userRole) {
        throw createHttpError(500, "USER role not found in database. Please run seed script first.");
    }

    // Create user with USER role
    const user = await prisma.user.create({
        data: {
            email,
            password: hashPassword,
            roleId: userRole.id, // Use the role ID from database
        },
        include: {
            role: true // Include role information in response
        }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export const loginUser = async (payload = {}) => {

    const { email, password } = payload;
    if (!email || !password) {
        throw createHttpError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
        where: { email: email },
        include: {
            role: true // Include role information
        }
    });

    if (!user) {
        throw createHttpError(401, "User does not exist! Please register");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw createHttpError(401, "Wrong password. Please try again");
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Generate token with user info
    const token = generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
}
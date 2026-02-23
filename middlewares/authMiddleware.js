import prisma from "../lib/prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { createHttpError } from "../utils/httpError.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw createHttpError(401, "Authentication required");
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            throw createHttpError(401, "User no longer exists");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(createHttpError(401, "Invalid or expired token"));
        }
        next(error);
    }
};

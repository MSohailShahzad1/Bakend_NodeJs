import { verifyToken } from '../utils/jwt.js';
import prisma from '../lib/prisma.js';

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createHttpError(401, 'Authentication required. No token provided.');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            throw createHttpError(401, 'Invalid or expired token');
        }

        // Check if user still exists in database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true }
        });

        if (!user) {
            throw createHttpError(401, 'User no longer exists');
        }

        // Attach user to request object
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role.name
        };

        next();
    } catch (error) {
        next(error);
    }
};
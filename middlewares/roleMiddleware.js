const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            throw createHttpError(401, 'Authentication required');
        }

        if (req.user.role !== 'ADMIN') {
            throw createHttpError(403, 'Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};
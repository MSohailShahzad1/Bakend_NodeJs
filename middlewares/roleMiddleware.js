import { createHttpError } from "../utils/httpError.js";

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(createHttpError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
        return next(createHttpError(403, "Forbidden: insufficient role"));
    }

    return next();
};

export const isAdmin = authorizeRoles("ADMIN");

import { registerUser, loginUser } from "../services/authServices.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser({ name, email, password });

        res.status(201).json({
            message: "User registered",
            user
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await loginUser({ email, password });

        res.json(data);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

import { registerUser, loginUser } from "../services/authServices.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser({ name, email, password });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await loginUser({ email, password });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data,
        });
    } catch (error) {
        next(error);
    }
};

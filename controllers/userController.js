import * as userService from "../services/userServices.js";

//GET /users

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();
        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

//GET /users/:id

export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json({
            success: true,
            data: user,
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

//DELETE /users/:id

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({
            success: true,
            message: "User deleted successfully",
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

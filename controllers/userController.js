import * as userService from "../services/userServices.js";

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        await userService.updateProfileImageService(req.user.id, imagePath);

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            imagePath,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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

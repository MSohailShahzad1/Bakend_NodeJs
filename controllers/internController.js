import * as internService from "../services/internServices.js";

export const createIntern = async (req, res, next) => {
    try {
        const intern = await internService.createIntern(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Intern created successfully",
            data: intern,
        });
    } catch (error) {
        next(error);
    }
};

export const getInterns = async (req, res, next) => {
    try {
        const interns = await internService.getInterns();
        res.status(200).json({
            success: true,
            data: interns,
        });
    } catch (error) {
        next(error);
    }
};

export const getInternById = async (req, res, next) => {
    try {
        const intern = await internService.getInternById(req.params.id);
        res.status(200).json({
            success: true,
            data: intern,
        });
    } catch (error) {
        next(error);
    }
};

export const updateIntern = async (req, res, next) => {
    try {
        const intern = await internService.updateIntern(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Intern updated successfully",
            data: intern,
        });
    } catch (error) {
        next(error);
    }
};

export const uploadInternProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No profile image uploaded",
            });
        }

        const profileImg = `/uploads/profiles/${req.file.filename}`;
        const intern = await internService.updateInternProfileImage(
            req.params.id,
            profileImg
        );

        return res.status(200).json({
            success: true,
            message: "Intern profile image uploaded successfully",
            data: intern,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteIntern = async (req, res, next) => {
    try {
        await internService.deleteIntern(req.params.id);
        res.status(200).json({
            success: true,
            message: "Intern deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

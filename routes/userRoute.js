import express from "express";
import { getUsers, getUserById, deleteUser, uploadProfileImage } from "../controllers/userController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.patch(
    "/:id/profile-image",
    authenticate,
    upload.single("image"),
    uploadProfileImage
);
router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUserById);
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;
import express from "express";
import {
    createIntern,
    deleteIntern,
    getInternById,
    getInterns,
    updateIntern,
    uploadInternProfileImage,
} from "../controllers/internController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { profileImageUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createIntern);
router.get("/", authenticate, getInterns);
router.get("/:id", authenticate, getInternById);
router.put("/:id", authenticate, updateIntern);
router.patch(
    "/:id/profile-image",
    authenticate,
    profileImageUpload.single("image"),
    uploadInternProfileImage
);
router.delete("/:id", authenticate, isAdmin, deleteIntern);

export default router;

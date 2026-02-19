import express from "express";
import { getUsers, getUserById, deleteUser } from "../controllers/userController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", authenticate, getUsers);
router.get("/users/:id", authenticate, getUserById);
router.delete("/users/:id", authenticate, isAdmin, deleteUser);

export default router;
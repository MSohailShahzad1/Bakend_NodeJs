import express from "express";
import { createUser } from "../controllers/userController.js";
import { getUsers } from "../controllers/userController.js";
import { getUserById } from "../controllers/userController.js";
import { deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

export default router;
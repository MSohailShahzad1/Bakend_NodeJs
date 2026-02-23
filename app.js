import express from "express";
import authRoutes from "./routes/authRoutes.js";
import internRoutes from "./routes/internRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/interns", internRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Intern Management Backend API");
});

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

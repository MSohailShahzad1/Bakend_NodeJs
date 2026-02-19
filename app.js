import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoute.js";
import authRoute from "./routes/authRoutes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes 
app.use("/api/files", fileRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoute)
app.get("/", (req, res) => {
    res.send("Welcome");
});

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

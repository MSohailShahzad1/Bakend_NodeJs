import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.use("/api/files", fileRoutes);
app.use("/api", userRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to the File Streaming API. Visit /api/files/stream to stream the file.");
});

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

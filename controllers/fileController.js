import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const streamFile = (req, res, next) => {
    const filePath = path.join(__dirname, "../data/largeFile.txt");

    const readStream = fs.createReadStream(filePath, {
        encoding: "utf8"
    });

    res.setHeader("Content-Type", "text/plain");

    readStream.pipe(res);

    readStream.on("error", (err) => {
        next(err);
    });
};
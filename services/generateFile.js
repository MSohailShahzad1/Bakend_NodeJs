// This file generates a large text file with 100,000 lines for testing purposes.
import fs from "fs";

const writeStream = fs.createWriteStream("./data/largeFile.txt");

for (let i = 0; i < 100000; i++) {
    writeStream.write(`Line ${i} - Sohail learning streams\n`);
}

writeStream.end();
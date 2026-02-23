import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
async function main() {
    try {
        console.log("Starting seed...");

        const saltRounds = 10;
        const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        const adminName = process.env.ADMIN_NAME || "System Admin";
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const adminUser = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                name: adminName,
                role: "ADMIN",
            },
            create: {
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        console.log("Admin user ready:", {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
        });

        console.log("Seed completed successfully!");
    } catch (error) {
        console.error("Error during seed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

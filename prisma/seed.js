import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt"

async function main() {
    try {
        console.log('Starting seed...');

        // Hash password
        const saltRounds = 10;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        // Create roles
        const adminRole = await prisma.role.upsert({
            where: { name: 'ADMIN' },
            update: {},
            create: {
                name: 'ADMIN',
            },
        });

        await prisma.role.upsert({
            where: { name: 'USER' },
            update: {},
            create: {
                name: 'USER',
            },
        });

        // Create admin user
        const adminUser = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                password: hashedPassword,
                roleId: adminRole.id,
            },
        });

        console.log('Admin user created:', {
            id: adminUser.id,
            email: adminUser.email,
            roleId: adminUser.roleId,
        });

        console.log('Seed completed successfully!');
    } catch (error) {
        console.error('Error during seed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
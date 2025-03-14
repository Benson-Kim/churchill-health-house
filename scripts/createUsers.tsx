import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	try {
		// Create a ward first
		const ward = await prisma.ward.create({
			data: {
				name: "General Ward",
				level: 1,
			},
		});

		console.log("✅ Ward created successfully with ID:", ward.id);

		// Hash password
		const hashedPassword = await bcrypt.hash("password123", 10);

		// Create Admin User
		const adminUser = await prisma.user.create({
			data: {
				email: "admin@hospital.com",
				password: hashedPassword,
				role: "ADMIN",
			},
		});

		console.log("✅ Admin user created successfully with ID:", adminUser.id);

		// Create Staff User with the created ward ID
		const staffUser = await prisma.user.create({
			data: {
				email: "staff@hospital.com",
				password: hashedPassword,
				role: "STAFF",
				staff: {
					create: {
						staffNumber: "STF001",
						firstName: "Staff",
						lastName: "User",
						niNumber: "NI123456A",
						dateOfBirth: new Date("1990-01-01"),
						address: "123 Hospital Street, London",
						jobType: "NURSE",
						wardId: ward.id, // Use the ward ID we just created
						joinDate: new Date(),
					},
				},
			},
		});

		console.log("✅ Staff user created successfully with ID:", staffUser.id);
		console.log("✅ All users created successfully!");
	} catch (error: any) {
		console.error("❌ Error creating users:", error);
		// Log more detailed error information
		if (error.code) {
			console.error(
				`Error code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`
			);
		}
	} finally {
		await prisma.$disconnect();
	}
}

// Run the script
main();

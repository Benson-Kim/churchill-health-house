import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate());

prisma.$connect().then(() => {
	console.log("Connected with connection pool");
});

process.on("beforeExit", async () => {
	await prisma.$disconnect();
});

// Update the type declaration to use the return type from $extends()
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma as unknown as PrismaClient;
}

export default prisma;

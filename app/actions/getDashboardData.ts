import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function getDashboardData() {
	const session = await getServerSession(authOptions);

	if (!session) return null; // Instead of redirecting here, handle it in the client.

	const stats = await prisma.$transaction([
		prisma.patient.count({ where: { leavingDate: null } }),
		prisma.staff.count(),
		prisma.room.count(),
		prisma.inventory.count({ where: { quantity: { lte: 10 } } }),
	]);

	const recentPatients = await prisma.patient.findMany({
		take: 5,
		orderBy: { admissionDate: "desc" },
		include: { room: { include: { ward: true } } },
	});

	const lowInventory = await prisma.inventory.findMany({
		where: { quantity: { lte: 10 } },
		take: 5,
		orderBy: { quantity: "asc" },
	});

	return { stats, recentPatients, lowInventory };
}

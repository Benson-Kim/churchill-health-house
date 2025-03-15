import { PrismaClient } from "@prisma/client";

const prisma = await PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const lastSynced = parseInt(req.query.lastSynced) || 0;

		try {
			const updates = await prisma.taskManager.findMany({
				where: { updatedAt: { gt: lastSynced } },
			});
			res.json(updates);
		} catch (error) {
			console.log("Fetch error:", error);
			res.status(500).json({ error: "Fetch failed" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}

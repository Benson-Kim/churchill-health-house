import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { data } = req.body;
		if (!data || data.length === 0)
			return res.json({ message: "No data to sync" });

		try {
			for (const item of data) {
				const existingTask = await prisma.taskManager.findUnique({
					where: { id: item.id },
				});

				if (!existingTask) {
					await prisma.taskManager.create({ data: item });
				} else {
					const updatedTask = {
						title:
							item.updated_at > existingTask.updatedAt
								? item.title
								: existingTask.title,
						description:
							item.updated_at > existingTask.updatedAt
								? item.description
								: existingTask.description,
						updatedAt: Math.max(item.updated_at, existingTask.updatedAt),
					};

					await prisma.taskManager.update({
						where: { id: item.id },
						data: updatedTask,
					});
				}
			}

			res.json({ message: "Sync successful with conflict resolution" });
		} catch (error) {
			console.log("Sync error:", error);
			res.status(500).json({ error: "Sync failed" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}

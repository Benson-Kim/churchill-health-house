import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const weekStart = new Date(today);
	weekStart.setDate(today.getDate() - today.getDay());

	const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

	// Fetch stats in parallel
	const [totalCount, todayCount, weekCount, monthCount] = await Promise.all([
		(
			prisma.examination.count as (
				args: Parameters<typeof prisma.examination.count>[0]
			) => ReturnType<typeof prisma.examination.count>
		)({}),
		(
			prisma.examination.count as (
				args: Parameters<typeof prisma.examination.count>[0]
			) => ReturnType<typeof prisma.examination.count>
		)({
			where: {
				examDate: {
					gte: today,
				},
			},
		}),
		(
			prisma.examination.count as (
				args: Parameters<typeof prisma.examination.count>[0]
			) => ReturnType<typeof prisma.examination.count>
		)({
			where: {
				examDate: {
					gte: weekStart,
				},
			},
		}),
		(
			prisma.examination.count as (
				args: Parameters<typeof prisma.examination.count>[0]
			) => ReturnType<typeof prisma.examination.count>
		)({
			where: {
				examDate: {
					gte: monthStart,
				},
			},
		}),
	]);

	return NextResponse.json({
		total: totalCount,
		today: todayCount,
		thisWeek: weekCount,
		thisMonth: monthCount,
	});
}

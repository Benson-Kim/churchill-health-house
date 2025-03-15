import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cacheData, getCachedData, invalidateCache } from "@/lib/redis";

import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

const CACHE_TTL = 3600;
const PAGE_SIZE = 10;

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1");
	const cacheKey = `examinations:page:${page}`;

	const cachedData = await getCachedData(cacheKey);
	if (cachedData) {
		return NextResponse.json(cachedData);
	}

	const [examinations, total] = await Promise.all([
		(
			prisma.examination.findMany as (
				args: Parameters<typeof prisma.examination.findMany>[0]
			) => ReturnType<typeof prisma.examination.findMany>
		)({
			take: PAGE_SIZE,
			skip: (page - 1) * PAGE_SIZE,
			include: { patient: true },
			orderBy: { examDate: "desc" },
		}),
		(
			prisma.examination.count as (
				args: Parameters<typeof prisma.examination.count>[0]
			) => ReturnType<typeof prisma.examination.count>
		)({}),
	]);

	const data = {
		examinations,
		pagination: {
			page,
			pageSize: PAGE_SIZE,
			total,
			totalPages: Math.ceil(total / PAGE_SIZE),
		},
	};

	await cacheData(cacheKey, data, CACHE_TTL);

	return NextResponse.json(data);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const data = await req.json();

	try {
		const examination = await prisma.examination.create({
			data: {
				patientId: data.patientId,
				temperature: parseFloat(data.temperature),
				bloodPressure: data.bloodPressure,
				pulse: parseInt(data.pulse),
				examDate: new Date(data.examDate),
			},
		});

		await invalidateCache("examinations:*");

		return NextResponse.json(examination);
	} catch (error) {
		console.log("Failed to create examination:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

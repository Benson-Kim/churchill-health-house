import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { invalidateCache } from "@/lib/redis";

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const data = await req.json();

	try {
		const examination = await prisma.examination.update({
			where: { id: params.id },
			data: {
				temperature: parseFloat(data.temperature),
				bloodPressure: data.bloodPressure,
				pulse: parseInt(data.pulse),
				examDate: new Date(data.examDate),
			},
			include: {
				patient: true,
			},
		});

		// Invalidate cache
		await invalidateCache("examinations:*");

		return NextResponse.json(examination);
	} catch (error) {
		console.error("Failed to update examination:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	try {
		await prisma.examination.delete({
			where: { id: params.id },
		});

		// Invalidate cache
		await invalidateCache("examinations:*");

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Failed to delete examination:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

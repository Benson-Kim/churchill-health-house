import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ExaminationList from "./components/ExaminationList";
import ExaminationStats from "./components/ExaminationStats";
import InteractiveHeader from "@/components/InteractiveHeader";

export default async function ExaminationsPage({
	searchParams,
}: {
	searchParams: { page?: string; search?: string };
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	// Fetch initial data from API
	const page = Number(searchParams.page) || 1;
	const search = searchParams.search || "";

	const params = new URLSearchParams({
		page: page.toString(),
		search,
	});

	const [examinationsRes, statsRes, patientsRes] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/examinations?${params}`, {
			headers: {
				Cookie: `next-auth.session-token=${session.token}`,
			},
		}),
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/examinations/stats`, {
			headers: {
				Cookie: `next-auth.session-token=${session.token}`,
			},
		}),
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients?active=true`, {
			headers: {
				Cookie: `next-auth.session-token=${session.token}`,
			},
		}),
	]);

	if (!examinationsRes.ok || !statsRes.ok || !patientsRes.ok) {
		throw new Error("Failed to fetch data");
	}

	const [examinations, stats, patients] = await Promise.all([
		examinationsRes.json(),
		statsRes.json(),
		patientsRes.json(),
	]);

	return (
		<div className="space-y-6">
			<InteractiveHeader
				moduleTitle="Examinations"
				onNewItem={() => {}}
				onGenerateReport={() => {}}
			/>

			<ExaminationStats stats={stats} />

			<ExaminationList initialData={examinations} patients={patients} />
		</div>
	);
}

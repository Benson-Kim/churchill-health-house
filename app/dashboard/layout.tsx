"use client";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect("/login");
		},
	});

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	);
}

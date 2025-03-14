"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardStats from "./components/DashboardStats";
import RecentPatients from "./components/RecentPatients";
import LowInventory from "./components/LowInventory";
import { getDashboardData } from "../actions/getDashboardData";

type Ward = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	level: number;
};

type Room = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	roomNumber: string;
	maxOccupants: number;
	wardId: string;
	ward: Ward;
};

type PatientWithRoom = {
	id: string;
	patientNumber: string;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	admissionDate: Date;
	leavingDate: Date | null;
	illness: string;
	address: string;
	telephone: string;
	email: string | null;
	roomId: string;
	room: Room;
	createdAt: Date;
	updatedAt: Date;
};

type InventoryItem = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	itemName: string;
	quantity: number;
	category: string;
	minQuantity: number;
};

export default function DashboardPage() {
	const [stats, setStats] = useState<number[]>([]);
	const [recentPatients, setRecentPatients] = useState<PatientWithRoom[]>([]);
	const [lowInventory, setLowInventory] = useState<InventoryItem[]>([]);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		async function fetchData() {
			try {
				const data = await getDashboardData();
				if (!data) {
					router.push("/login");
				} else {
					setStats(data.stats || []);
					setRecentPatients((data.recentPatients as PatientWithRoom[]) || []);
					setLowInventory((data.lowInventory as InventoryItem[]) || []);
				}
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [router]);

	if (loading) return <p className="text-center text-gray-500">Loading...</p>;

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Dashboard</h1>

			<DashboardStats stats={stats} />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<RecentPatients patients={recentPatients} />
				<LowInventory items={lowInventory} />
			</div>
		</div>
	);
}

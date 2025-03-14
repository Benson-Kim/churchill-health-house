"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	FaUserInjured,
	FaUserNurse,
	FaHospital,
	FaStethoscope,
	FaPrescription,
	FaBoxes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const menuItems = [
	{ href: "/dashboard", icon: MdDashboard, label: "Dashboard" },
	{ href: "/patients", icon: FaUserInjured, label: "Patients" },
	{ href: "/staff", icon: FaUserNurse, label: "Staff" },
	{ href: "/wards", icon: FaHospital, label: "Wards & Rooms" },
	{ href: "/examinations", icon: FaStethoscope, label: "Examinations" },
	{ href: "/prescriptions", icon: FaPrescription, label: "Prescriptions" },
	{ href: "/inventory", icon: FaBoxes, label: "Inventory" },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 h-screen bg-white shadow-md flex flex-col">
			<div className="p-4 border-b border-gray-200">
				<h1 className="text-xl font-bold text-gray-800">
					Churchill Health House
				</h1>
			</div>
			<nav className="flex-1 overflow-y-auto">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition ${
								isActive
									? "bg-blue-100 border-l-4 border-blue-500 text-blue-800 font-semibold"
									: ""
							}`}
						>
							<Icon className="w-5 h-5 mr-3" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}

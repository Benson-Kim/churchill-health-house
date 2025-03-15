"use client";

import { Examination, Patient } from "@prisma/client";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	FaSearch,
	FaUserInjured,
	FaThermometerHalf,
	FaHeartbeat,
	FaCalendarAlt,
} from "react-icons/fa";
import PaginationControls from "@/components/PaginationControls";
import ExaminationDialog from "./ExaminationDialog";

type ExaminationWithPatient = Examination & {
	patient: Patient;
};

interface ExaminationListProps {
	initialData: {
		examinations: ExaminationWithPatient[];
		pagination: {
			page: number;
			pageSize: number;
			total: number;
			totalPages: number;
		};
	};
	patients: Patient[];
}

export default function ExaminationList({
	initialData,
	patients,
}: ExaminationListProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [showExaminationDialog, setShowExaminationDialog] = useState(false);

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["examinations", page, searchTerm],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: page.toString(),
				search: searchTerm,
			});
			const response = await fetch(`/api/examinations?${params}`);
			if (!response.ok) throw new Error("Failed to fetch examinations");
			return response.json();
		},
		initialData: page === 1 ? initialData : undefined,
		staleTime: 1000 * 60, // 1 minute
	});

	const debouncedSearch = useCallback((value: string) => {
		setSearchTerm(value);
		setPage(1);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="bg-white rounded-lg shadow-md">
				<div className="p-6 border-b">
					<div className="relative">
						<input
							type="text"
							placeholder="Search examinations..."
							className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={searchTerm}
							onChange={(e) => debouncedSearch(e.target.value)}
						/>
						<FaSearch className="absolute left-3 top-3 text-gray-400" />
					</div>
				</div>

				<div className="divide-y">
					{data.examinations.map((examination: ExaminationWithPatient) => (
						<div
							key={examination.id}
							className="p-6 hover:bg-gray-50 transition-colors"
						>
							<div className="flex justify-between items-start">
								<div className="flex items-start space-x-4">
									<FaUserInjured className="w-12 h-12 text-blue-500" />
									<div>
										<h3 className="font-medium text-lg">
											{examination.patient.firstName}{" "}
											{examination.patient.lastName}
										</h3>
										<p className="text-sm text-gray-500">
											Patient ID: {examination.patient.patientNumber}
										</p>
										<div className="flex items-center space-x-4 mt-2">
											<div className="flex items-center">
												<FaCalendarAlt className="text-gray-400 mr-2" />
												<span className="text-sm">
													{new Date(examination.examDate).toLocaleDateString()}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
									<FaThermometerHalf className="text-red-500" />
									<div>
										<p className="text-sm text-gray-500">Temperature</p>
										<p className="font-medium">{examination.temperature}°C</p>
									</div>
								</div>
								<div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
									<FaHeartbeat className="text-red-500" />
									<div>
										<p className="text-sm text-gray-500">Blood Pressure</p>
										<p className="font-medium">{examination.bloodPressure}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
									<FaHeartbeat className="text-red-500" />
									<div>
										<p className="text-sm text-gray-500">Pulse</p>
										<p className="font-medium">{examination.pulse} bpm</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<PaginationControls
					currentPage={page}
					totalPages={data.pagination.totalPages}
					onPageChange={setPage}
				/>
			</div>

			{showExaminationDialog && (
				<ExaminationDialog
					isOpen={showExaminationDialog}
					onClose={() => setShowExaminationDialog(false)}
					patients={patients}
					onSuccess={refetch}
				/>
			)}
		</>
	);
}

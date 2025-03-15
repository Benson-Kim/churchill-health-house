"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Patient } from "@prisma/client";

interface ExaminationFormData {
	patientId: string;
	temperature: number;
	bloodPressure: string;
	pulse: number;
	examDate: string;
}

interface ExaminationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	patients: Patient[];
	examination?: {
		id: string;
		patientId: string;
		temperature: number;
		bloodPressure: string;
		pulse: number;
		examDate: Date;
	};
	onSuccess: () => void;
}

export default function ExaminationDialog({
	isOpen,
	onClose,
	patients,
	examination,
	onSuccess,
}: ExaminationDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ExaminationFormData>({
		defaultValues: examination
			? {
					patientId: examination.patientId,
					temperature: examination.temperature,
					bloodPressure: examination.bloodPressure,
					pulse: examination.pulse,
					examDate: new Date(examination.examDate).toISOString().split("T")[0],
			  }
			: undefined,
	});

	const onSubmit = async (data: ExaminationFormData) => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/examinations${examination ? `/${examination.id}` : ""}`,
				{
					method: examination ? "PUT" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			if (!response.ok) throw new Error("Failed to save examination");

			toast.success(
				`Examination ${examination ? "updated" : "added"} successfully`
			);
			onSuccess();
			onClose();
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-96">
				<h2 className="text-xl font-semibold mb-4">
					{examination ? "Edit Examination" : "New Examination"}
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Patient
						</label>
						<select
							{...register("patientId", { required: "Patient is required" })}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							disabled={!!examination}
						>
							<option value="">Select Patient</option>
							{patients.map((patient) => (
								<option key={patient.id} value={patient.id}>
									{patient.firstName} {patient.lastName}
								</option>
							))}
						</select>
						{errors.patientId && (
							<p className="mt-1 text-sm text-red-600">
								{errors.patientId.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Temperature (°C)
						</label>
						<input
							type="number"
							step="0.1"
							{...register("temperature", {
								required: "Temperature is required",
								min: {
									value: 35,
									message: "Temperature must be at least 35°C",
								},
								max: { value: 42, message: "Temperature must not exceed 42°C" },
							})}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						/>
						{errors.temperature && (
							<p className="mt-1 text-sm text-red-600">
								{errors.temperature.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Blood Pressure
						</label>
						<input
							type="text"
							{...register("bloodPressure", {
								required: "Blood pressure is required",
							})}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							placeholder="120/80"
						/>
						{errors.bloodPressure && (
							<p className="mt-1 text-sm text-red-600">
								{errors.bloodPressure.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Pulse (bpm)
						</label>
						<input
							type="number"
							{...register("pulse", {
								required: "Pulse is required",
								min: { value: 40, message: "Pulse must be at least 40 bpm" },
								max: { value: 200, message: "Pulse must not exceed 200 bpm" },
							})}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						/>
						{errors.pulse && (
							<p className="mt-1 text-sm text-red-600">
								{errors.pulse.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Examination Date
						</label>
						<input
							type="date"
							{...register("examDate", {
								required: "Examination date is required",
							})}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						/>
						{errors.examDate && (
							<p className="mt-1 text-sm text-red-600">
								{errors.examDate.message}
							</p>
						)}
					</div>

					<div className="flex justify-end space-x-3 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
							disabled={isLoading}
						>
							{isLoading ? "Saving..." : examination ? "Update" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

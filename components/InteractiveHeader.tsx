// components/InteractiveHeader.tsx
"use client";

import { FaFileDownload } from "react-icons/fa";

interface InteractiveHeaderProps {
	moduleTitle: string;
	onNewItem: () => void;
	onGenerateReport?: () => void;
}

export default function InteractiveHeader({
	moduleTitle,
	onNewItem,
	onGenerateReport,
}: InteractiveHeaderProps) {
	return (
		<div className="flex justify-between items-center">
			<h1 className="text-3xl font-bold">{moduleTitle}</h1>
			<div className="flex space-x-4">
				{onGenerateReport && (
					<button
						className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
						onClick={() => {
							// Use the provided report callback or fallback to the global function.
							onGenerateReport();
						}}
					>
						<FaFileDownload />
						<span>Generate Report</span>
					</button>
				)}
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
					onClick={onNewItem}
				>
					New {moduleTitle.slice(0, -1)}
				</button>
			</div>
		</div>
	);
}

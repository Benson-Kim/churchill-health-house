// PaginationControls.tsx
"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";

interface PaginationControlsProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
	totalPages,
	currentPage,
	onPageChange,
}) => {
	// Create page numbers with ellipsis for large page counts
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if there are few
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			// Logic for showing pages around current page
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Adjust range for beginning pages
			if (currentPage <= 3) {
				endPage = Math.min(4, totalPages - 1);
			}

			// Adjust range for ending pages
			if (currentPage >= totalPages - 2) {
				startPage = Math.max(2, totalPages - 3);
			}

			// Add ellipsis indicator
			if (startPage > 2) {
				pages.push("ellipsis1");
			}

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Add ending ellipsis if needed
			if (endPage < totalPages - 1) {
				pages.push("ellipsis2");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="p-4 flex justify-center items-center space-x-2">
			{/* Previous button */}
			{currentPage > 1 && (
				<button
					className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
					onClick={() => onPageChange(currentPage - 1)}
				>
					<FaChevronLeft className="mr-1 h-3 w-3" />
					Prev
				</button>
			)}

			{/* Page numbers */}
			{pageNumbers.map((page, index) => {
				if (page === "ellipsis1" || page === "ellipsis2") {
					return (
						<span key={`ellipsis-${index}`} className="px-3 py-1">
							<FaEllipsisH className="h-3 w-3 text-gray-400" />
						</span>
					);
				}

				return (
					<button
						key={page}
						onClick={() => onPageChange(page as number)}
						className={`px-3 py-1 rounded ${
							currentPage === page
								? "bg-blue-500 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						{page}
					</button>
				);
			})}

			{/* Next button */}
			{currentPage < totalPages && (
				<button
					className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
					onClick={() => onPageChange(currentPage + 1)}
				>
					Next
					<FaChevronRight className="ml-1 h-3 w-3" />
				</button>
			)}
		</div>
	);
};

export default PaginationControls;

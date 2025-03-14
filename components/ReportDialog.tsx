'use client'

import { useState } from 'react'
import { FaFilePdf, FaFileExcel, FaCalendarAlt } from 'react-icons/fa'
import { generatePDF, generateCSV, ReportType } from '@/lib/reports'

interface ReportDialogProps {
  type: ReportType
  data: any[]
  onClose: () => void
}

export default function ReportDialog({ type, data, onClose }: ReportDialogProps) {
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month'>('all')

  const filteredData = () => {
    if (dateRange === 'all') return data;

    const today = new Date();
    const startDate = new Date();
    if (dateRange === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    }

    return data.filter(item => {
      const itemDate = new Date(item.createdAt || item.examDate || item.prescriptionDate);
      return itemDate >= startDate && itemDate <= today;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setDateRange('all')}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                dateRange === 'all' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                dateRange === 'week' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                dateRange === 'month' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
              }`}
            >
              Last Month
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => generatePDF(type, filteredData())}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaFilePdf />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={() => generateCSV(type, filteredData())}
            className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaFileExcel />
            <span>Download Excel/CSV</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
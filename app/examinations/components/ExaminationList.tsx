'use client'

import { Examination, Patient } from '@prisma/client'
import { useState } from 'react'
import { FaSearch, FaUserInjured, FaThermometerHalf, FaHeartbeat, FaCalendarAlt } from 'react-icons/fa'
import ReportDialog from '@/components/ReportDialog'

type ExaminationWithPatient = Examination & {
  patient: Patient
}

interface ExaminationListProps {
  examinations: ExaminationWithPatient[]
}

export default function ExaminationList({ examinations }: ExaminationListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showReportDialog, setShowReportDialog] = useState(false)

  // Make the showReportDialog function available globally for the server component
  if (typeof window !== 'undefined') {
    (window as any).showReportDialog = () => setShowReportDialog(true)
  }

  const filteredExaminations = examinations.filter(exam => 
    exam.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.patient.patientNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="divide-y">
          {filteredExaminations.map(exam => (
            <div key={exam.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <FaUserInjured className="w-12 h-12 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-lg">
                      {exam.patient.firstName} {exam.patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Patient ID: {exam.patient.patientNumber}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="text-sm">
                          {new Date(exam.examDate).toLocaleDateString()}
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
                    <p className="font-medium">{exam.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                  <FaHeartbeat className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Blood Pressure</p>
                    <p className="font-medium">{exam.bloodPressure}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                  <FaHeartbeat className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Pulse</p>
                    <p className="font-medium">{exam.pulse} bpm</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showReportDialog && (
        <ReportDialog
          type="examinations"
          data={examinations}
          onClose={() => setShowReportDialog(false)}
        />
      )}
    </>
  )
}
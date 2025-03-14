'use client'

import { Patient, Room, Ward, NextOfKin, Examination } from '@prisma/client'
import { useState } from 'react'
import { FaSearch, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa'

type PatientWithRelations = Patient & {
  room: Room & {
    ward: Ward
  }
  nextOfKin: NextOfKin[]
  examinations: Examination[]
}

interface PatientListProps {
  patients: PatientWithRelations[]
}

export default function PatientList({ patients }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = patients.filter(patient => 
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="divide-y">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <FaUserCircle className="w-12 h-12 text-gray-400" />
                <div>
                  <h3 className="font-medium text-lg">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Patient ID: {patient.patientNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ward: {patient.room.ward.name} - Room: {patient.room.roomNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {patient.email && (
                  <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <FaEnvelope />
                  </button>
                )}
                <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <FaPhone />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Next of Kin</h4>
                <div className="space-y-2">
                  {patient.nextOfKin.map(kin => (
                    <div key={kin.id} className="text-sm">
                      <p className="font-medium">{kin.firstName} {kin.lastName}</p>
                      <p className="text-gray-500">{kin.telephone}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Latest Examination</h4>
                {patient.examinations[0] ? (
                  <div className="text-sm">
                    <p>Date: {new Date(patient.examinations[0].examDate).toLocaleDateString()}</p>
                    <p>Temperature: {patient.examinations[0].temperature}°C</p>
                    <p>Blood Pressure: {patient.examinations[0].bloodPressure}</p>
                    <p>Pulse: {patient.examinations[0].pulse} bpm</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No examinations recorded</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
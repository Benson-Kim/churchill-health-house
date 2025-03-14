'use client'

import { Prescription, Patient, Drug } from '@prisma/client'
import { useState } from 'react'
import { FaSearch, FaUserInjured, FaPrescriptionBottleAlt, FaClock, FaCalendarAlt } from 'react-icons/fa'

type PrescriptionWithRelations = Prescription & {
  patient: Patient
  drug: Drug
}

interface PrescriptionListProps {
  prescriptions: PrescriptionWithRelations[]
}

export default function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search prescriptions..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="divide-y">
        {filteredPrescriptions.map(prescription => (
          <div key={prescription.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <FaUserInjured className="w-12 h-12 text-blue-500" />
                <div>
                  <h3 className="font-medium text-lg">
                    {prescription.patient.firstName} {prescription.patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Patient ID: {prescription.patient.patientNumber}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(prescription.prescriptionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                <FaPrescriptionBottleAlt className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Medication</p>
                  <p className="font-medium">{prescription.drug.name}</p>
                  <p className="text-sm text-gray-500">{prescription.drug.code}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                <FaClock className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Treatment Length</p>
                  <p className="font-medium">{prescription.treatmentLength} days</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                <FaPrescriptionBottleAlt className="text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Dosage</p>
                  <p className="font-medium">{prescription.dosage}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
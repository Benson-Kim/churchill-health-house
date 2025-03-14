'use client'

import { Patient, Room, Ward } from '@prisma/client'

type PatientWithRoom = Patient & {
  room: Room & {
    ward: Ward
  }
}

export default function RecentPatients({ patients }: { patients: PatientWithRoom[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Admissions</h2>
      <div className="space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{patient.firstName} {patient.lastName}</h3>
                <p className="text-sm text-gray-500">
                  Ward: {patient.room.ward.name} - Room: {patient.room.roomNumber}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(patient.admissionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
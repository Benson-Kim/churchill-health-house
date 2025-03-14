'use client'

import { Ward, Room, Staff, Patient } from '@prisma/client'
import { useState } from 'react'
import { FaSearch, FaHospital, FaDoorOpen, FaUserNurse, FaUserInjured, FaChevronDown, FaChevronUp } from 'react-icons/fa'

type RoomWithPatients = Room & {
  patients: Patient[]
}

type WardWithRelations = Ward & {
  rooms: RoomWithPatients[]
  staff: Staff[]
  _count: {
    rooms: number
    staff: number
  }
}

interface WardListProps {
  wards: WardWithRelations[]
}

export default function WardList({ wards }: WardListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedWards, setExpandedWards] = useState<Set<string>>(new Set())

  const toggleWard = (wardId: string) => {
    const newExpanded = new Set(expandedWards)
    if (newExpanded.has(wardId)) {
      newExpanded.delete(wardId)
    } else {
      newExpanded.add(wardId)
    }
    setExpandedWards(newExpanded)
  }

  const filteredWards = wards.filter(ward => 
    ward.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search wards..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="divide-y">
        {filteredWards.map(ward => (
          <div key={ward.id} className="p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleWard(ward.id)}
            >
              <div className="flex items-center space-x-4">
                <FaHospital className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium text-lg">Ward {ward.name}</h3>
                  <p className="text-sm text-gray-500">Level {ward.level}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <FaDoorOpen className="text-gray-400" />
                  <span>{ward._count.rooms} Rooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserNurse className="text-gray-400" />
                  <span>{ward._count.staff} Staff</span>
                </div>
                {expandedWards.has(ward.id) ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedWards.has(ward.id) && (
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Rooms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ward.rooms.map(room => (
                      <div key={room.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Room {room.roomNumber}</h5>
                            <p className="text-sm text-gray-500">
                              Capacity: {room.patients.length}/{room.maxOccupants}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaUserInjured className="text-gray-400" />
                            <span>{room.patients.length}</span>
                          </div>
                        </div>
                        {room.patients.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Current Patients:</p>
                            <ul className="text-sm text-gray-500">
                              {room.patients.map(patient => (
                                <li key={patient.id}>
                                  {patient.firstName} {patient.lastName}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Staff Members</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ward.staff.map(member => (
                      <div key={member.id} className="border rounded-lg p-4">
                        <h5 className="font-medium">
                          {member.firstName} {member.lastName}
                        </h5>
                        <p className="text-sm text-gray-500">{member.jobType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
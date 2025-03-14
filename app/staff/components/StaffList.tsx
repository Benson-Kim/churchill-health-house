'use client'

import { Staff, Ward, User } from '@prisma/client'
import { useState } from 'react'
import { FaSearch, FaEnvelope, FaPhone, FaUserCircle, FaBriefcase, FaHospital } from 'react-icons/fa'

type StaffWithRelations = Staff & {
  ward: Ward
  user: {
    email: string
    role: string
  }
}

interface StaffListProps {
  staff: StaffWithRelations[]
}

const jobTypeLabels = {
  HEAD_NURSE: 'Head Nurse',
  NURSE: 'Nurse',
  DOCTOR: 'Doctor',
  OFFICE_STAFF: 'Office Staff',
  ROOM_ATTENDANT: 'Room Attendant'
}

export default function StaffList({ staff }: StaffListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterJobType, setFilterJobType] = useState<string>('ALL')

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesJobType = filterJobType === 'ALL' || member.jobType === filterJobType

    return matchesSearch && matchesJobType
  })

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterJobType}
            onChange={(e) => setFilterJobType(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            {Object.entries(jobTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="divide-y">
        {filteredStaff.map(member => (
          <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <FaUserCircle className="w-12 h-12 text-gray-400" />
                <div>
                  <h3 className="font-medium text-lg">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Staff ID: {member.staffNumber}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <FaBriefcase className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {jobTypeLabels[member.jobType]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <FaHospital className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {member.ward.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <FaEnvelope />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <FaPhone />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <p>Email: {member.user.email}</p>
                  <p>Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
                  <p>Role: {member.user.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
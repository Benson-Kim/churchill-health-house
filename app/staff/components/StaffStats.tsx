'use client'

import { Ward } from '@prisma/client'
import { FaUserMd, FaUserNurse, FaUsers, FaHospital } from 'react-icons/fa'

interface StatsProps {
  stats: {
    total: number
    doctors: number
    nurses: number
    support: number
  }
  wards: (Ward & {
    _count: {
      staff: number
    }
  })[]
}

const statCards = [
  { label: 'Total Staff', icon: FaUsers, color: 'bg-blue-500' },
  { label: 'Doctors', icon: FaUserMd, color: 'bg-green-500' },
  { label: 'Nurses', icon: FaUserNurse, color: 'bg-purple-500' },
  { label: 'Support Staff', icon: FaHospital, color: 'bg-orange-500' }
]

export default function StaffStats({ stats, wards }: StatsProps) {
  const values = [stats.total, stats.doctors, stats.nurses, stats.support]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm">{card.label}</h3>
                  <p className="text-2xl font-semibold">{values[index]}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Staff Distribution by Ward</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wards.map(ward => (
            <div key={ward.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{ward.name}</h3>
              <p className="text-2xl font-semibold mt-2">{ward._count.staff}</p>
              <p className="text-sm text-gray-500">Staff Members</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
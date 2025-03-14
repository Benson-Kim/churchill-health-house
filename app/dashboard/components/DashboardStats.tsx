'use client'

import { FaUserInjured, FaUserNurse, FaDoorOpen, FaExclamationTriangle } from 'react-icons/fa'

const statCards = [
  { label: 'Current Patients', icon: FaUserInjured, color: 'bg-blue-500' },
  { label: 'Staff Members', icon: FaUserNurse, color: 'bg-green-500' },
  { label: 'Total Rooms', icon: FaDoorOpen, color: 'bg-purple-500' },
  { label: 'Low Stock Items', icon: FaExclamationTriangle, color: 'bg-red-500' }
]

export default function DashboardStats({ stats }: { stats: number[] }) {
  return (
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
                <p className="text-2xl font-semibold">{stats[index]}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
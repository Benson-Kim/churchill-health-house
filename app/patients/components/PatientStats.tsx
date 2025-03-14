'use client'

import { FaUserInjured, FaHospitalUser, FaCalendarPlus, FaCalendarCheck } from 'react-icons/fa'

interface StatsProps {
  stats: {
    total: number
    current: number
    admitted: number
    discharged: number
  }
}

const statCards = [
  { label: 'Total Patients', icon: FaUserInjured, color: 'bg-blue-500' },
  { label: 'Current Patients', icon: FaHospitalUser, color: 'bg-green-500' },
  { label: 'New This Week', icon: FaCalendarPlus, color: 'bg-purple-500' },
  { label: 'Discharged This Week', icon: FaCalendarCheck, color: 'bg-orange-500' }
]

export default function PatientStats({ stats }: StatsProps) {
  const values = [stats.total, stats.current, stats.admitted, stats.discharged]

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
                <p className="text-2xl font-semibold">{values[index]}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
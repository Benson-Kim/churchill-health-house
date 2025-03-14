'use client'

import { FaStethoscope, FaUserInjured, FaChartLine, FaCalendarCheck } from 'react-icons/fa'

interface StatsProps {
  stats: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
  }
}

const statCards = [
  { label: 'Total Examinations', icon: FaStethoscope, color: 'bg-blue-500' },
  { label: 'Today\'s Examinations', icon: FaUserInjured, color: 'bg-green-500' },
  { label: 'This Week', icon: FaChartLine, color: 'bg-purple-500' },
  { label: 'This Month', icon: FaCalendarCheck, color: 'bg-orange-500' }
]

export default function ExaminationStats({ stats }: StatsProps) {
  const values = [stats.total, stats.today, stats.thisWeek, stats.thisMonth]

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
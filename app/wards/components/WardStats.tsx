'use client'

import { FaHospital, FaDoorOpen, FaBed, FaUsers } from 'react-icons/fa'

interface StatsProps {
  stats: {
    totalWards: number
    totalRooms: number
    occupiedRooms: number
    totalCapacity: number
  }
}

const statCards = [
  { label: 'Total Wards', icon: FaHospital, color: 'bg-blue-500' },
  { label: 'Total Rooms', icon: FaDoorOpen, color: 'bg-green-500' },
  { label: 'Occupied Rooms', icon: FaBed, color: 'bg-purple-500' },
  { label: 'Total Capacity', icon: FaUsers, color: 'bg-orange-500' }
]

export default function WardStats({ stats }: StatsProps) {
  const values = [stats.totalWards, stats.totalRooms, stats.occupiedRooms, stats.totalCapacity]

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
'use client'

import { FaBoxes, FaExclamationTriangle, FaWarehouse, FaChartLine } from 'react-icons/fa'

interface StatsProps {
  stats: {
    totalItems: number
    lowStock: number
    totalQuantity: number
    categories: number
  }
}

const statCards = [
  { label: 'Total Items', icon: FaBoxes, color: 'bg-blue-500' },
  { label: 'Low Stock Items', icon: FaExclamationTriangle, color: 'bg-red-500' },
  { label: 'Total Quantity', icon: FaWarehouse, color: 'bg-green-500' },
  { label: 'Categories', icon: FaChartLine, color: 'bg-purple-500' }
]

export default function InventoryStats({ stats }: StatsProps) {
  const values = [stats.totalItems, stats.lowStock, stats.totalQuantity, stats.categories]

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
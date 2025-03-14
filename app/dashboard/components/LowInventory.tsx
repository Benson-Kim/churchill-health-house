'use client'

import { Inventory } from '@prisma/client'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function LowInventory({ items }: { items: Inventory[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Low Stock Alert</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <div>
                <h3 className="font-medium">{item.itemName}</h3>
                <p className="text-sm text-gray-500">Category: {item.category}</p>
              </div>
            </div>
            <span className="text-red-500 font-semibold">{item.quantity} left</span>
          </div>
        ))}
      </div>
    </div>
  )
}
'use client'

import { Inventory } from '@prisma/client'
import { useState } from 'react'
import { FaSearch, FaBoxes, FaExclamationTriangle, FaTag } from 'react-icons/fa'

interface InventoryListProps {
  items: Inventory[]
}

export default function InventoryList({ items }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')

  const categories = ['ALL', ...new Set(items.map(item => item.category))]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="divide-y">
        {filteredItems.map(item => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  item.quantity <= item.minQuantity ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <FaBoxes className={`w-6 h-6 ${
                    item.quantity <= item.minQuantity ? 'text-red-500' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{item.itemName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <FaTag className="text-gray-400" />
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-2xl font-semibold ${
                  item.quantity <= item.minQuantity ? 'text-red-500' : 'text-gray-700'
                }`}>
                  {item.quantity}
                </p>
                <p className="text-sm text-gray-500">in stock</p>
              </div>
            </div>

            {item.quantity <= item.minQuantity && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <p className="text-sm text-red-700">
                  Low stock alert! Minimum quantity: {item.minQuantity}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
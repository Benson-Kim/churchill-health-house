import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import InventoryList from './components/InventoryList'
import InventoryStats from './components/InventoryStats'

export default async function InventoryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const inventory = await prisma.inventory.findMany({
    orderBy: {
      itemName: 'asc'
    }
  })

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.quantity <= item.minQuantity).length,
    totalQuantity: inventory.reduce((acc, item) => acc + item.quantity, 0),
    categories: new Set(inventory.map(item => item.category)).size
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Add New Item
        </button>
      </div>

      <InventoryStats stats={stats} />
      <InventoryList items={inventory} />
    </div>
  )
}
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import WardList from './components/WardList'
import WardStats from './components/WardStats'

export default async function WardsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const wards = await prisma.ward.findMany({
    include: {
      rooms: {
        include: {
          patients: {
            where: {
              leavingDate: null
            }
          }
        }
      },
      staff: true,
      _count: {
        select: {
          rooms: true,
          staff: true
        }
      }
    }
  })

  const stats = {
    totalWards: wards.length,
    totalRooms: wards.reduce((acc, ward) => acc + ward.rooms.length, 0),
    occupiedRooms: wards.reduce((acc, ward) => 
      acc + ward.rooms.filter(room => room.patients.length > 0).length, 0
    ),
    totalCapacity: wards.reduce((acc, ward) => 
      acc + ward.rooms.reduce((sum, room) => sum + room.maxOccupants, 0), 0
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ward & Room Management</h1>
        <div className="space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Add New Ward
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Add New Room
          </button>
        </div>
      </div>

      <WardStats stats={stats} />
      <WardList wards={wards} />
    </div>
  )
}
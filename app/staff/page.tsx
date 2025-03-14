import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import StaffList from './components/StaffList'
import StaffStats from './components/StaffStats'

export default async function StaffPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const staff = await prisma.staff.findMany({
    include: {
      ward: true,
      user: {
        select: {
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      lastName: 'asc'
    }
  })

  const stats = {
    total: staff.length,
    doctors: staff.filter(s => s.jobType === 'DOCTOR').length,
    nurses: staff.filter(s => s.jobType === 'NURSE' || s.jobType === 'HEAD_NURSE').length,
    support: staff.filter(s => s.jobType === 'OFFICE_STAFF' || s.jobType === 'ROOM_ATTENDANT').length
  }

  const wards = await prisma.ward.findMany({
    include: {
      _count: {
        select: { staff: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Add New Staff Member
        </button>
      </div>

      <StaffStats stats={stats} wards={wards} />
      <StaffList staff={staff} />
    </div>
  )
}
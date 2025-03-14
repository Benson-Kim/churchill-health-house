import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PatientList from './components/PatientList'
import PatientStats from './components/PatientStats'

export default async function PatientsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const patients = await prisma.patient.findMany({
    include: {
      room: {
        include: {
          ward: true
        }
      },
      nextOfKin: true,
      examinations: {
        orderBy: {
          examDate: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      admissionDate: 'desc'
    }
  })

  const stats = {
    total: await prisma.patient.count(),
    current: await prisma.patient.count({ where: { leavingDate: null } }),
    admitted: await prisma.patient.count({
      where: {
        admissionDate: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }
    }),
    discharged: await prisma.patient.count({
      where: {
        leavingDate: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Add New Patient
        </button>
      </div>

      <PatientStats stats={stats} />
      <PatientList patients={patients} />
    </div>
  )
}
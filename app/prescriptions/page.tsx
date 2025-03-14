import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PrescriptionList from './components/PrescriptionList'
import PrescriptionStats from './components/PrescriptionStats'

export default async function PrescriptionsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const prescriptions = await prisma.prescription.findMany({
    include: {
      patient: true,
      drug: true
    },
    orderBy: {
      prescriptionDate: 'desc'
    }
  })

  const today = new Date()
  
  const activePresciptions = prescriptions.filter(prescription => {
    const endDate = new Date(prescription.prescriptionDate)
    endDate.setDate(endDate.getDate() + prescription.treatmentLength)
    return endDate >= today
  })

  const uniquePatients = new Set(prescriptions.map(p => p.patientId)).size

  const averageDuration = Math.round(
    prescriptions.reduce((acc, curr) => acc + curr.treatmentLength, 0) / prescriptions.length
  )

  const stats = {
    total: prescriptions.length,
    active: activePresciptions.length,
    patients: uniquePatients,
    averageDuration
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          New Prescription
        </button>
      </div>

      <PrescriptionStats stats={stats} />
      <PrescriptionList prescriptions={prescriptions} />
    </div>
  )
}
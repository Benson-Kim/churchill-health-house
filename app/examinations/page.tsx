import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ExaminationList from './components/ExaminationList'
import ExaminationStats from './components/ExaminationStats'
import ReportDialog from '@/components/ReportDialog'
import { FaFileDownload } from 'react-icons/fa'

export default async function ExaminationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const examinations = await prisma.examination.findMany({
    include: {
      patient: true
    },
    orderBy: {
      examDate: 'desc'
    }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const stats = {
    total: examinations.length,
    today: examinations.filter(exam => new Date(exam.examDate) >= today).length,
    thisWeek: examinations.filter(exam => new Date(exam.examDate) >= weekStart).length,
    thisMonth: examinations.filter(exam => new Date(exam.examDate) >= monthStart).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Examination Records</h1>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            onClick={() => {
              // @ts-ignore - This is handled by the client component
              window.showReportDialog?.('examinations', examinations)
            }}
          >
            <FaFileDownload />
            <span>Generate Report</span>
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            New Examination
          </button>
        </div>
      </div>

      <ExaminationStats stats={stats} />
      <ExaminationList examinations={examinations} />
    </div>
  )
}
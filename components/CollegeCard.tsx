'use client'
import { CutoffTrendChart } from './CutoffTrendChart'

type College = {
  id: number
  college_name: string
  course: string
  location: string
  cutoff_rank: number
  trendData: { year: number; cutoff_rank: number }[]
}

export default function CollegeCard({ college }: { college: College }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3 hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-gray-800 leading-tight">
        {college.college_name}
      </h3>
      <p className="text-sm text-gray-600">
        {college.course} <span className="text-gray-400">•</span> {college.location}
      </p>
      <p className="text-sm">
        Cutoff Rank:{' '}
        <span className="text-indigo-700 font-mono font-medium text-base">
          {college.cutoff_rank}
        </span>
      </p>
      <div className="pt-2">
        <CutoffTrendChart data={college.trendData} />
      </div>
    </div>
  )
}

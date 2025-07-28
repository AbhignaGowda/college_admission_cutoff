'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const examOptions = {
  NEET: {
    categories: ['General', 'OBC', 'SC', 'ST'],
    courses: ['MBBS', 'BDS', 'BAMS']
  },
  JEE: {
    categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    courses: ['B.Tech CSE', 'B.Tech ME', 'B.Tech EE']
  }
}

export default function Home() {
  const [exam, setExam] = useState<keyof typeof examOptions>('NEET')
  const [category, setCategory] = useState(examOptions[exam].categories[0])
  const [course, setCourse] = useState('')
  const [rank, setRank] = useState('')
  const router = useRouter()

  useEffect(() => {
    setCategory(examOptions[exam].categories[0])
    setCourse('')
  }, [exam])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 px-4 text-gray-900">
      <h1 className="text-4xl font-semibold text-gray-900 mb-10">College Admission Insights</h1>

      <form
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
        onSubmit={e => {
          e.preventDefault()
          router.push(`/results?exam=${exam}&category=${category}&rank=${rank}&course=${course}`)
        }}
      >
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Exam</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={exam}
            onChange={e => setExam(e.target.value as any)}
          >
            {Object.keys(examOptions).map(e => <option key={e}>{e}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Category</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {examOptions[exam].categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Course (optional)</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={course}
            onChange={e => setCourse(e.target.value)}
          >
            <option value="">Any</option>
            {examOptions[exam].courses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Your Rank</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={rank}
            onChange={e => setRank(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
        >
          Show Colleges
        </button>
      </form>
    </div>
  )
}

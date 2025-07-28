'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export function CollegeTrendChart({ exam, category, college, course }) {
  const [trend, setTrend] = useState([])

  useEffect(() => {
    async function fetchTrend() {
      const { data } = await supabase
        .from('colleges')
        .select('year,cutoff_rank')
        .eq('exam', exam)
        .eq('category', category)
        .eq('college_name', college)
        .eq('course', course)
        .order('year')
      setTrend(data || [])
    }
    fetchTrend()
  }, [exam, category, college, course])

  if (trend.length < 2) return null

  return (
    <div className="mt-2 h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={trend}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" fontSize={11} stroke="#6b7280" />
          <YAxis hide />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelStyle={{ color: '#6b7280' }}
          />
          <Line
            type="monotone"
            dataKey="cutoff_rank"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

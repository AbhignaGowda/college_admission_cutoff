'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function CutoffTrendChart({
  data,
}: {
  data: { year: number; cutoff_rank: number }[];
}) {
  if (!data || data.length < 2) return null;

  return (
    <div className="mt-2 h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            fontSize={10}
            stroke="#6b7280"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            reversed
            hide
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            cursor={{ stroke: '#2563eb', strokeWidth: 0.3 }}
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
  );
}

'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SimpleChartProps {
  data: number[]
}

export default function SimpleChart({ data }: SimpleChartProps) {
  if (!data || data.length === 0) return null

  // Transform data for recharts
  const chartData = data.map((value, index) => ({
    name: `${index}h`,
    value: value,
  }))

  return (
    <div className="flex flex-col h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: -10 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            stroke="currentColor" 
            style={{ fontSize: '10px', opacity: 0.6 }}
          />
          <YAxis 
            stroke="currentColor" 
            style={{ fontSize: '10px', opacity: 0.6 }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Time labels */}
      {/* <div className="flex justify-between text-xs text-foreground/50  mt-1 ">
        <span>{data.length}h ago</span>
        <span>Now</span>
      </div> */}
    </div>
  )
}

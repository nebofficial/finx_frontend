'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const data = [
  { month: 'Jan', users: 400, subscriptions: 240, revenue: 2400 },
  { month: 'Feb', users: 520, subscriptions: 290, revenue: 2210 },
  { month: 'Mar', users: 480, subscriptions: 300, revenue: 2290 },
  { month: 'Apr', users: 620, subscriptions: 350, revenue: 2000 },
  { month: 'May', users: 750, subscriptions: 400, revenue: 2181 },
  { month: 'Jun', users: 890, subscriptions: 450, revenue: 2500 },
]

export default function MetricsChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Growth Metrics</h2>
        <p className="text-sm text-gray-600 mt-1">User signups and subscription trends</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="subscriptions" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

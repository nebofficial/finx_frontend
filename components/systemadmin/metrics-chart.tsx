'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', users: 400, tenants: 24, revenue: 2400 },
  { month: 'Feb', users: 500, tenants: 28, revenue: 2800 },
  { month: 'Mar', users: 450, tenants: 32, revenue: 3200 },
  { month: 'Apr', users: 600, tenants: 35, revenue: 3800 },
  { month: 'May', users: 800, tenants: 42, revenue: 4500 },
  { month: 'Jun', users: 900, tenants: 48, revenue: 5200 },
]

export default function MetricsChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">System Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CCCCCC" />
            <XAxis stroke="#555555" />
            <YAxis stroke="#555555" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#D7EEFC',
                border: '1px solid #CCCCCC',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#00AA00" strokeWidth={2} />
            <Line type="monotone" dataKey="tenants" stroke="#0000FF" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#FF0000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

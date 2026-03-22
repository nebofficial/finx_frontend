'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', users: 400, activeUsers: 240 },
  { month: 'Feb', users: 550, activeUsers: 380 },
  { month: 'Mar', users: 720, activeUsers: 520 },
  { month: 'Apr', users: 950, activeUsers: 720 },
  { month: 'May', users: 1200, activeUsers: 950 },
  { month: 'Jun', users: 1543, activeUsers: 1320 },
]

export default function UserGrowthChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
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
            <Area
              type="monotone"
              dataKey="users"
              fill="#00AA00"
              stroke="#00AA00"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="activeUsers"
              fill="#0000FF"
              stroke="#0000FF"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

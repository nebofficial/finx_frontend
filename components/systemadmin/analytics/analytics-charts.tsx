'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { day: 'Mon', pageviews: 4000, clicks: 2400, conversions: 240 },
  { day: 'Tue', pageviews: 3000, clicks: 1398, conversions: 221 },
  { day: 'Wed', pageviews: 2000, clicks: 9800, conversions: 229 },
  { day: 'Thu', pageviews: 2780, clicks: 3908, conversions: 200 },
  { day: 'Fri', pageviews: 1890, clicks: 4800, conversions: 221 },
  { day: 'Sat', pageviews: 2390, clicks: 3800, conversions: 250 },
  { day: 'Sun', pageviews: 3490, clicks: 4300, conversions: 210 },
]

export default function AnalyticsCharts() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Weekly Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar dataKey="pageviews" fill="#00AA00" />
            <Bar dataKey="clicks" fill="#0000FF" />
            <Bar dataKey="conversions" fill="#FFFF00" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsCharts({
  revenueTrend,
  loading,
}: {
  revenueTrend?: { month: string; revenue: number }[]
  loading?: boolean
}) {
  const data =
    revenueTrend && revenueTrend.length > 0
      ? revenueTrend.map((r) => ({
          month: r.month,
          revenue: Number(r.revenue || 0),
        }))
      : [{ month: '—', revenue: 0 }]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Invoice revenue by month</CardTitle>
        <p className="text-xs text-muted-foreground">
          {loading ? 'Loading…' : revenueTrend?.length ? 'From platform invoices (last ~8 months)' : 'No invoice history yet'}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CCCCCC" />
            <XAxis dataKey="month" stroke="#555555" />
            <YAxis stroke="#555555" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#D7EEFC',
                border: '1px solid #CCCCCC',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#00AA00" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

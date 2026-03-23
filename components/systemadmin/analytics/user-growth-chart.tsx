'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function UserGrowthChart({
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
        <CardTitle className="text-card-foreground">Revenue trend</CardTitle>
        <p className="text-xs text-muted-foreground">
          {loading ? 'Loading…' : 'Same source as bar chart — cumulative invoicing pattern'}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
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
            <Area type="monotone" dataKey="revenue" fill="#00AA00" stroke="#00AA00" fillOpacity={0.35} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

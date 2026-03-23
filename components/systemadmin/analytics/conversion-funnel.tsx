'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ConversionFunnel({
  planDistribution,
  loading,
}: {
  planDistribution?: { plan: string; count: number }[]
  loading?: boolean
}) {
  const rows = planDistribution?.length
    ? planDistribution.map((p) => ({
        name: p.plan || 'Plan',
        count: Number(p.count || 0),
      }))
    : [{ name: loading ? 'Loading…' : 'No active subscriptions', count: 0 }]

  const max = Math.max(1, ...rows.map((r) => r.count))
  const total = rows.reduce((s, r) => s + r.count, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Active subscriptions by plan</CardTitle>
        <p className="text-xs text-muted-foreground">
          Live distribution from billing data{total ? ` · ${total} total` : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rows.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">{step.name}</span>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{step.count.toLocaleString()}</span>
                  <span className="font-semibold text-foreground">
                    {total ? ((step.count / total) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
              </div>
              <Progress value={max ? (step.count / max) * 100 : 0} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

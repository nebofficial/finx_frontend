'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, Minus } from 'lucide-react'

type Stats = {
  mrr?: number
  active_subscriptions?: number
  pending_revenue?: number
  total_tenants?: number
}

export default function AnalyticsMetrics({
  stats,
  loading,
}: {
  stats?: Stats
  loading?: boolean
}) {
  const mrr = Number(stats?.mrr ?? 0)
  const tenants = Number(stats?.total_tenants ?? 0)
  const subs = Number(stats?.active_subscriptions ?? 0)
  const pending = Number(stats?.pending_revenue ?? 0)
  const arpu = tenants > 0 ? mrr / tenants : 0

  const metrics = [
    {
      title: 'Total tenants',
      value: loading ? '—' : String(tenants),
      change: 'Cooperatives on platform',
      direction: 'neutral' as const,
      color: 'text-muted-foreground',
    },
    {
      title: 'Active subscriptions',
      value: loading ? '—' : String(subs),
      change: 'Current billing period',
      direction: subs > 0 ? ('up' as const) : ('neutral' as const),
      color: subs > 0 ? 'text-green-600' : 'text-muted-foreground',
    },
    {
      title: 'Pending revenue',
      value: loading ? '—' : `$${pending.toFixed(2)}`,
      change: 'Unpaid / partial (active subs)',
      direction: 'neutral' as const,
      color: 'text-amber-600',
    },
    {
      title: 'MRR (monthly est.)',
      value: loading ? '—' : `$${mrr.toFixed(2)}`,
      change: tenants ? `~$${arpu.toFixed(2)} / tenant` : 'No tenants yet',
      direction: mrr > 0 ? ('up' as const) : ('neutral' as const),
      color: mrr > 0 ? 'text-green-600' : 'text-muted-foreground',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground mb-2">{metric.value}</div>
            <div className="flex items-center gap-2">
              {metric.direction === 'up' ? (
                <ArrowUp size={16} className={metric.color} />
              ) : (
                <Minus size={16} className={metric.color} />
              )}
              <span className="text-xs text-muted-foreground">{metric.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

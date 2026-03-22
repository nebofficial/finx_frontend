'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import { supportApi } from '@/services/api/supportApi'

export default function SupportStats() {
  const [stats, setStats] = useState({
    open: 0,
    in_progress: 0,
    waiting_for_user: 0,
    resolved: 0,
    closed: 0,
    slaAtRisk: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await supportApi.getStats()
        const c = res.data.data?.counts || {}
        if (!cancelled) {
          setStats({
            open: c.open ?? 0,
            in_progress: c.in_progress ?? 0,
            waiting_for_user: c.waiting_for_user ?? 0,
            resolved: c.resolved ?? 0,
            closed: c.closed ?? 0,
            slaAtRisk: res.data.data?.slaAtRisk ?? 0,
            total: res.data.data?.total ?? 0,
          })
        }
      } catch {
        if (!cancelled) setLoading(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const items = [
    {
      title: 'Open & active',
      value: loading ? '—' : String(stats.open + stats.in_progress + stats.waiting_for_user),
      change: `${stats.open} open · ${stats.in_progress} in progress`,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'text-red-600',
    },
    {
      title: 'Resolved',
      value: loading ? '—' : String(stats.resolved),
      change: `${stats.closed} closed`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      title: 'SLA at risk',
      value: loading ? '—' : String(stats.slaAtRisk),
      change: 'Past resolution due date',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      title: 'Total tickets',
      value: loading ? '—' : String(stats.total),
      change: 'Across all tenants',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            <div className={`${stat.color}`}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

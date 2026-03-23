'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Zap, Clock, Loader2 } from 'lucide-react'
import { platformApi, type PlatformStatusPayload } from '@/services/api/platformApi'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'

export default function PerformanceMonitoringPage() {
  const [data, setData] = useState<PlatformStatusPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await platformApi.getStatus()
        if (mounted) setData(res.data?.data as PlatformStatusPayload)
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to load performance snapshot'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const heapPct =
    data && data.process.memory_heap_total_mb > 0
      ? Math.round((data.process.memory_heap_used_mb / data.process.memory_heap_total_mb) * 100)
      : 0

  const chartData = data
    ? [
        { label: 'Heap used %', value: heapPct },
        { label: 'Host RAM %', value: data.host.totalmem_mb > 0
          ? Math.round(((data.host.totalmem_mb - data.host.freemem_mb) / data.host.totalmem_mb) * 100)
          : 0 },
        { label: 'Load×10', value: Math.min(100, Math.round(data.host.loadavg_1m * 10)) },
      ]
    : [{ label: '—', value: 0 }]

  const metrics = [
    {
      label: 'Process uptime',
      value: data ? `${Math.floor(data.process.uptime_seconds / 3600)}h` : '—',
      change: 'API Node process',
      icon: Clock,
      color: 'bg-blue-100',
    },
    {
      label: 'Heap used',
      value: data ? `${data.process.memory_heap_used_mb} MB` : '—',
      change: data ? `${heapPct}% of V8 heap` : '—',
      icon: Zap,
      color: 'bg-yellow-100',
    },
    {
      label: 'Load (1m)',
      value: data ? data.host.loadavg_1m.toFixed(2) : '—',
      change: data?.host.platform || '—',
      icon: Activity,
      color: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Performance</h1>
        <p className="text-muted-foreground mt-2">Snapshot from the FinX API server (not a full APM)</p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="w-6 h-6 text-card-foreground" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Relative indicators</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Single sample normalized for a quick visual — not time-series history.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" stroke="#6B7280" />
            <YAxis stroke="#6B7280" domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00AA00" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

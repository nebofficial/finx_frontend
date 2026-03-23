'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Activity, Server, Database, Loader2 } from 'lucide-react'
import { platformApi, type PlatformStatusPayload } from '@/services/api/platformApi'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 48) return `${Math.floor(h / 24)}d ${h % 24}h`
  return `${h}h ${m}m`
}

export default function SystemStatusPage() {
  const [data, setData] = useState<PlatformStatusPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await platformApi.getStatus()
        if (mounted) setData(res.data?.data as PlatformStatusPayload)
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to load platform status'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const memPct =
    data?.host?.totalmem_mb && data.host.totalmem_mb > 0
      ? Math.round(((data.host.totalmem_mb - data.host.freemem_mb) / data.host.totalmem_mb) * 100)
      : null

  const services = [
    {
      name: 'HTTP API (this process)',
      status: data?.database_ok ? 'healthy' : 'critical',
      detail: data ? `Uptime ${formatUptime(data.process.uptime_seconds)}` : '—',
      extra: data ? `Heap ${data.process.memory_heap_used_mb} / ${data.process.memory_heap_total_mb} MB` : '—',
    },
    {
      name: 'PostgreSQL (main)',
      status: data?.database_ok ? 'healthy' : 'critical',
      detail: data?.database_ok ? 'Connection OK' : 'Cannot authenticate',
      extra: data?.node_env ?? '—',
    },
    {
      name: 'SMTP (outbound email)',
      status: data?.smtp_configured ? 'healthy' : 'warning',
      detail: data?.smtp_configured ? 'Configured' : 'Set SMTP_* in backend .env',
      extra: 'Invoices & welcome mail',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">System status</h1>
        <p className="text-muted-foreground mt-2">Live snapshot from the FinX API process and host</p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Process memory (heap)</p>
              <p className="text-3xl font-bold text-card-foreground">
                {data ? `${data.process.memory_heap_used_mb} MB` : '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">V8 heap used / total</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Host memory used</p>
              <p className="text-3xl font-bold text-card-foreground">{memPct != null ? `${memPct}%` : '—'}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {data
                  ? `${data.host.totalmem_mb - data.host.freemem_mb} / ${data.host.totalmem_mb} MB · ${data.host.platform}`
                  : '—'}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Server className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Load average (1m)</p>
              <p className="text-3xl font-bold text-card-foreground">
                {data ? data.host.loadavg_1m.toFixed(2) : '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {data ? `5m ${data.host.loadavg_5m.toFixed(2)} · 15m ${data.host.loadavg_15m.toFixed(2)}` : '—'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Services</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-semibold text-sm">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Detail</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Notes</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.name} className="border-b border-border-light">
                  <td className="py-3 px-4 text-sm font-medium">{s.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        s.status === 'healthy'
                          ? 'bg-green-100 text-green-800'
                          : s.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{s.detail}</td>
                  <td className="text-sm text-muted-foreground py-3 px-4">{s.extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Historical CPU/memory charts are not collected yet; values above are point-in-time from the API server.
      </p>
    </div>
  )
}

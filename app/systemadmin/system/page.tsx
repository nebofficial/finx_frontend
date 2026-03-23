'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  Server,
  Database,
  Activity,
  Loader2,
  Mail,
} from 'lucide-react'
import { billingApi } from '@/services/api/billingApi'
import { platformApi } from '@/services/api/platformApi'
import { auditApi } from '@/services/api/auditApi'
import { formatDistanceToNow } from 'date-fns'

export default function SystemAdminPage() {
  const [loading, setLoading] = useState(true)
  const [totalTenants, setTotalTenants] = useState(0)
  const [activeTenants, setActiveTenants] = useState(0)
  const [mrr, setMrr] = useState(0)
  const [activeSubs, setActiveSubs] = useState(0)
  const [smtpOk, setSmtpOk] = useState(false)
  const [dbOk, setDbOk] = useState(true)
  const [events, setEvents] = useState<
    { id: string; event: string; time: string; type: 'success' | 'warning' }[]
  >([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [billRes, stRes, logRes] = await Promise.all([
          billingApi.getAnalytics(),
          platformApi.getStatus(),
          auditApi.getLogs({ page: 1, limit: 8 }).catch(() => null),
        ])
        if (!mounted) return
        const tenantStats = billRes.data?.data?.tenants as { total?: number; active?: number } | undefined
        const stats = billRes.data?.data?.stats
        setTotalTenants(Number(tenantStats?.total ?? stats?.total_tenants ?? 0))
        setActiveTenants(Number(tenantStats?.active ?? 0))
        setMrr(Number(stats?.mrr ?? 0))
        setActiveSubs(Number(stats?.active_subscriptions ?? 0))

        const st = stRes.data?.data
        setSmtpOk(Boolean(st?.smtp_configured))
        setDbOk(Boolean(st?.database_ok))

        const logs = logRes?.data?.data?.logs ?? []
        setEvents(
          logs.map((l: { id: string; action: string; status?: string; createdAt?: string }) => ({
            id: l.id,
            event: `${l.action}${l.status === 'failure' ? ' (failed)' : ''}`,
            time: l.createdAt ? formatDistanceToNow(new Date(l.createdAt), { addSuffix: true }) : '—',
            type: l.status === 'failure' ? ('warning' as const) : ('success' as const),
          }))
        )
      } catch {
        if (mounted) {
          setDbOk(false)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const stats = [
    {
      icon: Building2,
      label: 'Total tenants',
      value: loading ? '—' : String(totalTenants),
      change: `${activeTenants} active`,
      color: 'bg-blue-100',
    },
    {
      icon: Users,
      label: 'Active subscriptions',
      value: loading ? '—' : String(activeSubs),
      change: 'Billable subs',
      color: 'bg-green-100',
    },
    {
      icon: TrendingUp,
      label: 'MRR (est.)',
      value: loading ? '—' : `$${mrr.toFixed(2)}`,
      change: 'From billing analytics',
      color: 'bg-yellow-100',
    },
    {
      icon: AlertCircle,
      label: 'SMTP email',
      value: smtpOk ? 'Ready' : 'Not set',
      change: smtpOk ? 'Invoices can be emailed' : 'Configure .env SMTP_*',
      color: smtpOk ? 'bg-green-100' : 'bg-red-100',
    },
  ]

  const systemHealth = [
    { name: 'API (Node)', status: dbOk ? 'healthy' : 'critical', uptime: dbOk ? 'Running' : 'DB check failed' },
    { name: 'PostgreSQL', status: dbOk ? 'healthy' : 'critical', uptime: dbOk ? 'Connected' : 'Down' },
    { name: 'Outbound email', status: smtpOk ? 'healthy' : 'warning', uptime: smtpOk ? 'SMTP configured' : 'Not configured' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-2">System-wide metrics and health status</p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading platform data…
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-xs mt-2 text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-card-foreground" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">System Health</h2>
          <div className="space-y-3">
            {systemHealth.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      system.status === 'healthy' ? 'bg-green-600' : system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-600'
                    }`}
                  />
                  <span className="text-sm font-medium text-card-foreground">{system.name}</span>
                </div>
                <span className="text-xs text-muted-foreground text-right max-w-[140px]">{system.uptime}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="default" className="bg-primary">
              <Link href="/systemadmin/system/status">
                <Server className="w-4 h-4 mr-2" />
                System status
              </Link>
            </Button>
            <Button asChild variant="default" className="bg-primary">
              <Link href="/systemadmin/system/settings">
                <Mail className="w-4 h-4 mr-2" />
                Global settings
              </Link>
            </Button>
            <Button asChild variant="default" className="bg-primary">
              <Link href="/systemadmin/monitoring/performance">
                <Activity className="w-4 h-4 mr-2" />
                Performance
              </Link>
            </Button>
            <Button asChild variant="default" className="bg-primary">
              <Link href="/systemadmin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/systemadmin/tenants">
                <Database className="w-4 h-4 mr-2" />
                Tenants
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/systemadmin/monitoring/audit-logs">
                <BarChart3 className="w-4 h-4 mr-2" />
                Audit logs
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent audit events</h2>
        <div className="space-y-3">
          {events.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">No recent audit entries.</p>
          ) : (
            events.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 border border-border-light rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle, Shield, Loader2 } from 'lucide-react'
import { auditApi } from '@/services/api/auditApi'
import { formatDistanceToNow } from 'date-fns'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type AuditRow = {
  id: string
  action: string
  actor_email?: string | null
  resource?: string | null
  ip_address?: string | null
  status?: string
  createdAt?: string
}

export default function SecurityMonitoringPage() {
  const [loading, setLoading] = useState(true)
  const [failures, setFailures] = useState<AuditRow[]>([])
  const [failureTotal, setFailureTotal] = useState(0)
  const [auditTotal, setAuditTotal] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [failRes, allRes] = await Promise.all([
          auditApi.getLogs({ page: 1, limit: 25, status: 'failure' }),
          auditApi.getLogs({ page: 1, limit: 1 }),
        ])
        if (!mounted) return
        setFailures(failRes.data?.data?.logs ?? [])
        setFailureTotal(Number(failRes.data?.data?.meta?.total ?? 0))
        setAuditTotal(Number(allRes.data?.data?.meta?.total ?? 0))
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to load security audit data'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const successApprox = Math.max(0, auditTotal - failureTotal)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Security monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Failed platform audit events (auth failures, errors). Full history is in{' '}
          <Link href="/systemadmin/monitoring/audit-logs" className="text-primary underline">
            Audit logs
          </Link>
          .
        </p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs mb-2">Failed audit events (total)</p>
              <p className="text-2xl font-bold text-card-foreground">{loading ? '—' : failureTotal}</p>
            </div>
            <div className="p-2 rounded bg-red-100">
              <AlertCircle className="w-5 h-5 text-red-700" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs mb-2">Successful events (approx.)</p>
              <p className="text-2xl font-bold text-card-foreground">{loading ? '—' : successApprox}</p>
            </div>
            <div className="p-2 rounded bg-emerald-100">
              <Shield className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs mb-2">All audit entries</p>
              <p className="text-2xl font-bold text-card-foreground">{loading ? '—' : auditTotal}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <Link href="/systemadmin/monitoring/audit-logs">Open logs</Link>
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent failures</h2>
        {failures.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No failed audit events recorded.</p>
        ) : (
          <div className="space-y-3">
            {failures.map((log) => (
              <div
                key={log.id}
                className="border border-red-200 bg-red-50/60 dark:bg-red-950/20 rounded-lg p-4 text-sm"
              >
                <div className="font-medium text-card-foreground">{log.action}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2 text-muted-foreground text-xs">
                  <div>Actor: {log.actor_email || '—'}</div>
                  <div>Resource: {log.resource || '—'}</div>
                  <div>IP: {log.ip_address || '—'}</div>
                  <div>
                    {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }) : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 border-dashed">
        <h2 className="text-lg font-semibold text-card-foreground mb-2">IP allow / block lists</h2>
        <p className="text-sm text-muted-foreground">
          Not implemented in-app. Use your reverse proxy, cloud WAF, or PostgreSQL / firewall rules for IP filtering.
        </p>
      </Card>
    </div>
  )
}

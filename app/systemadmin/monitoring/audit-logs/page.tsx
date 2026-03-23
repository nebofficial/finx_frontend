'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, Download, Search, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { auditApi } from '@/services/api/auditApi'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error'

type AuditRow = {
  id: string
  actor_email?: string | null
  action: string
  resource?: string | null
  resource_id?: string | null
  status?: string
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<AuditRow[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await auditApi.getLogs({ page, limit })
      const data = res.data?.data
      setLogs(data?.logs ?? [])
      const meta = data?.meta
      if (meta) {
        setTotalPages(Math.max(1, meta.totalPages ?? 1))
        setTotal(meta.total ?? 0)
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load audit logs.'))
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = logs.filter((log) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      (log.actor_email || '').toLowerCase().includes(q) ||
      (log.action || '').toLowerCase().includes(q) ||
      (log.resource || '').toLowerCase().includes(q)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success'
      case 'failure':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-blue-100 text-blue-800'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
    if (action.includes('CHANGE') || action.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800'
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">Track all system activities and user actions</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or resource…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-input-border pl-9"
              />
            </div>
          </div>
          <Button type="button" variant="outline" className="border border-border-light text-card-foreground bg-white hover:bg-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button type="button" variant="outline" className="border border-border-light text-card-foreground bg-white hover:bg-muted" disabled>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading audit logs…
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Action</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Resource</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => {
                    const ts = log.createdAt ? format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss') : '—'
                    const details =
                      typeof log.metadata === 'object' && log.metadata && 'method' in log.metadata
                        ? `${String(log.metadata.method)} ${String(log.metadata.path || '')}`
                        : log.resource_id || '—'
                    return (
                      <tr key={log.id} className="border-b border-border-light hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-card-foreground">{ts}</td>
                        <td className="py-3 px-4 text-sm text-card-foreground font-medium">{log.actor_email || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded ${getActionColor(log.action)}`}>{log.action}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-card-foreground">{log.resource || '—'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(log.status || 'success')}`}
                          >
                            {(log.status || 'success').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate" title={details}>
                          {details}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground py-8 text-center">No audit entries match.</p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} · {total} total entries
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

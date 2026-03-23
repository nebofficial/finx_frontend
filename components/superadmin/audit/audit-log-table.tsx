'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { tenantNotificationApi } from '@/services/api/tenantNotificationApi'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'
import { superAdminApi } from '@/services/api/superAdminApi'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AuditFilterState } from '@/components/superadmin/audit/audit-filters'

type LogRow = {
  id: string
  timestamp: string
  action: string
  organization: string
  user: string
  description: string
  status: 'success' | 'warning'
}

function startOfRange(range: string): number | null {
  const now = new Date()
  if (range === 'today') {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return d.getTime()
  }
  if (range === 'week') {
    const d = new Date(now)
    d.setDate(d.getDate() - 7)
    return d.getTime()
  }
  if (range === 'month') {
    const d = new Date(now)
    d.setMonth(d.getMonth() - 1)
    return d.getTime()
  }
  return null
}

const PAGE_SIZE = 8

export default function AuditLogTable({ filters }: { filters: AuditFilterState }) {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<LogRow[]>([])
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [orgRes, notifRes, ticketRes] = await Promise.all([
        superAdminApi.getOrganization(),
        tenantNotificationApi.list({ limit: 300 }),
        tenantSupportApi.list({ limit: 300 }),
      ])

      const org = orgRes.data?.data?.organization as { name?: string } | undefined

      const notifications = (notifRes.data?.data?.notifications || []) as {
        id: string
        title?: string
        message?: string
        type?: string
        status?: string
        sent_by?: string | null
        createdAt?: string
      }[]

      const tickets = (ticketRes.data?.data?.tickets || []) as {
        id: string
        subject?: string
        description?: string
        status?: string
        createdAt?: string
        creator_user?: { email?: string; name?: string } | null
      }[]

      const fromNotif: LogRow[] = notifications.map((n) => ({
        id: `n-${n.id}`,
        timestamp: n.createdAt || new Date().toISOString(),
        action: `Notification · ${(n.type || 'message').replace(/_/g, ' ')}`,
        organization: org?.name || 'This cooperative',
        user: n.sent_by ? String(n.sent_by).slice(0, 8) + '…' : 'System',
        description: (n.title ? `${n.title}: ` : '') + (n.message || '').slice(0, 200),
        status: n.status === 'failed' ? 'warning' : 'success',
      }))

      const fromTickets: LogRow[] = tickets.map((t) => ({
        id: `t-${t.id}`,
        timestamp: t.createdAt || new Date().toISOString(),
        action: 'Support ticket',
        organization: org?.name || 'This cooperative',
        user: t.creator_user?.email || t.creator_user?.name || '—',
        description: (t.subject || '') + (t.description ? ` — ${t.description.slice(0, 120)}` : ''),
        status: t.status === 'open' || t.status === 'in_progress' ? 'warning' : 'success',
      }))

      const merged = [...fromNotif, ...fromTickets].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setRows(merged)
    } catch {
      toast.error('Failed to load activity log.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [filters.source, filters.search, filters.dateRange])

  const filtered = useMemo(() => {
    const start = startOfRange(filters.dateRange)
    const q = filters.search.trim().toLowerCase()
    return rows.filter((r) => {
      if (start && new Date(r.timestamp).getTime() < start) return false
      if (filters.source === 'all') {
        /* ok */
      } else if (filters.source === 'support_ticket') {
        if (!r.id.startsWith('t-')) return false
      } else {
        if (!r.id.startsWith('n-')) return false
        const typePart = r.action.toLowerCase()
        if (!typePart.includes(filters.source.replace(/_/g, ' '))) return false
      }
      if (q) {
        const blob = `${r.action} ${r.description} ${r.user}`.toLowerCase()
        if (!blob.includes(q)) return false
      }
      return true
    })
  }, [rows, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  if (loading) {
    return (
      <Card className="p-8 flex items-center gap-2 text-muted-foreground border-border">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading activity…
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="text-card-foreground font-semibold">Timestamp</TableHead>
              <TableHead className="text-card-foreground font-semibold">Action</TableHead>
              <TableHead className="text-card-foreground font-semibold">Cooperative</TableHead>
              <TableHead className="text-card-foreground font-semibold">User</TableHead>
              <TableHead className="text-card-foreground font-semibold">Description</TableHead>
              <TableHead className="text-card-foreground font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                  No entries match your filters.
                </TableCell>
              </TableRow>
            ) : (
              slice.map((log) => (
                <TableRow key={log.id} className="border-b border-border hover:bg-muted/40">
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-card-foreground">{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.organization}</TableCell>
                  <TableCell className="text-muted-foreground text-sm break-all max-w-[140px]">{log.user}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[280px] break-words">{log.description}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {log.status === 'success' ? 'OK' : 'Attention'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {filtered.length > PAGE_SIZE && (
        <Card className="p-4 border-border flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {safePage} of {totalPages} · {filtered.length} entries
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                  className={safePage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                  className={safePage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Card>
      )}
    </div>
  )
}

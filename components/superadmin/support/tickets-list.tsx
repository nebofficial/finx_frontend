'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Loader2 } from 'lucide-react'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'
import { toast } from 'sonner'
import type { TicketFilterState } from '@/components/superadmin/support/ticket-filters'

type TicketRow = {
  id: string
  ticket_no?: string
  subject: string
  priority: string
  status: string
  createdAt?: string
}

function statusLabel(s: string) {
  if (s === 'in_progress') return 'In progress'
  return s.replace(/_/g, ' ')
}

export default function TicketsList({ filters }: { filters: TicketFilterState }) {
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tenantSupportApi.list({ limit: 500 })
      const list = res.data?.data?.tickets ?? []
      setTickets(Array.isArray(list) ? list : [])
    } catch {
      toast.error('Failed to load tickets.')
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return tickets.filter((ticket) => {
      if (filters.status !== 'all' && ticket.status !== filters.status) return false
      if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false
      if (!q) return true
      const idMatch = ticket.id.toLowerCase().includes(q)
      const ticketNoMatch = (ticket.ticket_no || '').toLowerCase().includes(q)
      const sub = (ticket.subject || '').toLowerCase().includes(q)
      return idMatch || ticketNoMatch || sub
    })
  }, [tickets, filters.search, filters.status, filters.priority])

  if (loading) {
    return (
      <Card className="p-8 flex items-center gap-2 text-muted-foreground border-border">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading tickets…
      </Card>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-sm border-border">No support tickets yet.</Card>
    )
  }

  if (filtered.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-sm border-border">
        No tickets match your filters ({tickets.length} total).
      </Card>
    )
  }

  return (
    <Card className="border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-card-foreground font-semibold">Ticket</TableHead>
            <TableHead className="text-card-foreground font-semibold">Subject</TableHead>
            <TableHead className="text-card-foreground font-semibold">Priority</TableHead>
            <TableHead className="text-card-foreground font-semibold">Status</TableHead>
            <TableHead className="text-card-foreground font-semibold">Created</TableHead>
            <TableHead className="text-right text-card-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((ticket) => (
            <TableRow key={ticket.id} className="border-b border-border hover:bg-muted/40">
              <TableCell className="font-mono font-medium text-card-foreground">
                {ticket.ticket_no || ticket.id.slice(0, 8)}
              </TableCell>
              <TableCell className="font-medium text-card-foreground max-w-[240px] truncate">{ticket.subject}</TableCell>
              <TableCell>
                <Badge
                  className={
                    ticket.priority === 'high' || ticket.priority === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : ticket.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }
                >
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    ticket.status === 'open'
                      ? 'bg-red-100 text-red-800'
                      : ticket.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }
                >
                  {statusLabel(ticket.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/support/tickets/${ticket.id}`} className="cursor-pointer flex items-center">
                        <Eye size={16} className="mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

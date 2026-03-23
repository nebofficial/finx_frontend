'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, MoreVertical, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supportApi } from '@/services/api/supportApi'
import { toast } from 'sonner'

type TicketRow = {
  id: string
  ticket_no?: string
  subject: string
  priority: string
  status: string
  createdAt?: string
  updatedAt?: string
  tenant?: { name?: string; email?: string } | null
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-900',
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  waiting_for_user: 'bg-gray-100 text-gray-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-green-100 text-green-700',
  reopened: 'bg-orange-100 text-orange-800',
}

function fmtStatus(s: string) {
  return s.replace(/_/g, ' ')
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await supportApi.getTickets({ limit: 100 })
      const list = res.data?.data?.tickets ?? []
      setTickets(Array.isArray(list) ? list : [])
    } catch {
      toast.error('Failed to load support tickets.')
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading tickets…
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No tickets yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted">
                  <TableHead className="text-card-foreground">Ticket</TableHead>
                  <TableHead className="text-card-foreground">Subject</TableHead>
                  <TableHead className="text-card-foreground">Tenant</TableHead>
                  <TableHead className="text-card-foreground">Priority</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                  <TableHead className="text-card-foreground">Updated</TableHead>
                  <TableHead className="text-card-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => {
                  const label = ticket.ticket_no || ticket.id.slice(0, 8)
                  const customer = ticket.tenant?.name || ticket.tenant?.email || '—'
                  const pri = ticket.priority || 'medium'
                  const st = ticket.status || 'open'
                  const updatedRaw = ticket.updatedAt || ticket.createdAt
                  const updated = updatedRaw
                    ? formatDistanceToNow(new Date(updatedRaw), { addSuffix: true })
                    : '—'
                  return (
                    <TableRow key={ticket.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-card-foreground">{label}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[220px] truncate">
                        {ticket.subject}
                      </TableCell>
                      <TableCell className="text-card-foreground">{customer}</TableCell>
                      <TableCell>
                        <Badge className={priorityColors[pri] || priorityColors.medium}>{pri}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[st] || 'bg-muted text-muted-foreground'}>
                          {fmtStatus(st)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{updated}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Ticket actions">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/systemadmin/support/${ticket.id}`} className="flex items-center">
                                <MessageSquare size={16} className="mr-2" />
                                Open / reply
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

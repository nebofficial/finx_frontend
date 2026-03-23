'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'
import { toast } from 'sonner'

type Ticket = {
  id: string
  ticket_no?: string
  subject: string
  description: string
  status: string
  priority: string
  category?: string
  createdAt?: string
  updatedAt?: string
}

export default function TenantSupportTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : ''

  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [notes, setNotes] = useState('')
  const [resolving, setResolving] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await tenantSupportApi.get(id)
      const t = res.data?.data?.ticket as Ticket | undefined
      if (!t) {
        toast.error('Ticket not found.')
        router.replace('/superadmin/support')
        return
      }
      setTicket(t)
    } catch {
      toast.error('Failed to load ticket.')
      router.replace('/superadmin/support')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    void load()
  }, [load])

  const handleResolve = async () => {
    if (!notes.trim()) {
      toast.error('Resolution notes are required.')
      return
    }
    setResolving(true)
    try {
      await tenantSupportApi.resolve(id, notes.trim())
      toast.success('Ticket resolved')
      void load()
      setNotes('')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message)
          : 'Failed to resolve'
      toast.error(msg || 'Failed to resolve')
    } finally {
      setResolving(false)
    }
  }

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading…
      </div>
    )
  }

  const label = ticket.ticket_no || ticket.id.slice(0, 8)
  const canResolve = ticket.status !== 'resolved' && ticket.status !== 'closed'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <Link href="/superadmin/support">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>
              <Badge
                className={
                  ticket.priority === 'high' || ticket.priority === 'critical'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
              >
                {ticket.priority}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {label}
              {ticket.category ? ` • ${ticket.category}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Status</p>
          <p className="text-sm font-bold text-gray-900 mt-2 capitalize">{ticket.status.replace(/_/g, ' ')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Created</p>
          <p className="text-sm font-bold text-gray-900 mt-2">
            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—'}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Updated</p>
          <p className="text-sm font-bold text-gray-900 mt-2">
            {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : '—'}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
      </Card>

      {canResolve && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Resolve ticket</h2>
          <p className="text-sm text-gray-600">
            Uses <code className="text-xs bg-gray-100 px-1 rounded">PATCH /support/:id/resolve</code> (SuperAdmin or Admin).
          </p>
          <div className="space-y-2">
            <Label htmlFor="resolution_notes">Resolution notes *</Label>
            <Textarea
              id="resolution_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="What was done to resolve this issue?"
            />
          </div>
          <Button onClick={() => void handleResolve()} disabled={resolving}>
            {resolving ? 'Submitting…' : 'Mark resolved'}
          </Button>
        </Card>
      )}
    </div>
  )
}

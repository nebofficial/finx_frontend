'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { format, formatDistanceToNow } from 'date-fns'
import { supportApi } from '@/services/api/supportApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Loader2, Paperclip, Send, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Reply = {
  id: string
  message: string
  reply_type: string
  author_name?: string
  author_kind: string
  createdAt: string
  edited_at?: string | null
  attachments?: { url: string; name?: string; mime?: string }[]
}

type Ticket = {
  id: string
  ticket_no: string
  subject: string
  description: string
  status: string
  priority: string
  category: string
  team?: string | null
  escalation_level?: number
  tenant?: { name?: string; email?: string }
  assignee?: { id: string; name: string; email?: string } | null
  requester_name?: string
  sla_response_due_at?: string | null
  sla_resolution_due_at?: string | null
  resolution_notes?: string | null
  initial_attachments?: { url: string; name?: string }[]
  replies?: Reply[]
  createdAt: string
  updatedAt: string
}

function publicFileUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://127.0.0.1:5000')
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

const statusOptions = [
  'open',
  'in_progress',
  'waiting_for_user',
  'resolved',
  'closed',
  'reopened',
] as const

function fmtStatus(s: string) {
  return s.replace(/_/g, ' ')
}

export default function SupportTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [agents, setAgents] = useState<{ id: string; name: string; email?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [internal, setInternal] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)
  const [sending, setSending] = useState(false)

  const [status, setStatus] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [statusSaving, setStatusSaving] = useState(false)

  const [assignee, setAssignee] = useState<string>('none')
  const [team, setTeam] = useState('none')
  const [escalation, setEscalation] = useState('1')
  const [assignSaving, setAssignSaving] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editReply, setEditReply] = useState<Reply | null>(null)
  const [editText, setEditText] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [tRes, aRes] = await Promise.all([supportApi.getTicket(id), supportApi.getAgents()])
      setTicket(tRes.data.data?.ticket ?? null)
      setAgents(aRes.data.data?.agents ?? [])
    } catch {
      toast.error('Failed to load ticket')
      router.push('/systemadmin/support')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!ticket) return
    setStatus(ticket.status)
    setResolutionNotes(ticket.resolution_notes || '')
    setAssignee(ticket.assignee?.id ?? 'none')
    setTeam(ticket.team || 'none')
    setEscalation(String(ticket.escalation_level ?? 1))
  }, [ticket])

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) {
      toast.error('Enter a message')
      return
    }
    setSending(true)
    try {
      const fd = new FormData()
      fd.append('message', replyText.trim())
      fd.append('type', internal ? 'internal' : 'public')
      if (files) {
        Array.from(files).forEach((f) => fd.append('files', f))
      }
      await supportApi.reply(id, fd)
      setReplyText('')
      setFiles(null)
      setInternal(false)
      toast.success('Reply sent')
      await load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const saveStatus = async () => {
    if (!ticket || !status) return
    setStatusSaving(true)
    try {
      await supportApi.updateStatus(id, {
        status,
        resolution_notes: status === 'resolved' ? resolutionNotes : undefined,
      })
      toast.success('Status updated')
      await load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Invalid status change')
    } finally {
      setStatusSaving(false)
    }
  }

  const saveAssign = async () => {
    setAssignSaving(true)
    try {
      await supportApi.assign(id, {
        assignedTo: assignee === 'none' ? null : assignee,
        team: team === 'none' ? null : team,
        escalation_level: parseInt(escalation, 10) || 1,
      })
      toast.success('Assignment saved')
      await load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to save assignment')
    } finally {
      setAssignSaving(false)
    }
  }

  const saveEditReply = async () => {
    if (!editReply || !editText.trim()) return
    try {
      await supportApi.updateReply(id, editReply.id, editText.trim())
      toast.success('Reply updated')
      setEditOpen(false)
      setEditReply(null)
      await load()
    } catch {
      toast.error('Failed to update reply')
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await supportApi.deleteReply(id, deleteId)
      toast.success('Reply removed')
      setDeleteId(null)
      await load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Only system administrators can delete replies')
    }
  }

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading ticket…
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/systemadmin/support" aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
              <Badge variant="outline" className="font-mono">
                {ticket.ticket_no}
              </Badge>
              <Badge>{ticket.priority}</Badge>
              <Badge variant="secondary">{fmtStatus(ticket.status)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {ticket.tenant?.name} · Requester: {ticket.requester_name ?? '—'} · Created{' '}
              {format(new Date(ticket.createdAt), 'PPp')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Original request</CardTitle>
              <CardDescription>Category: {ticket.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{ticket.description}</p>
              {ticket.initial_attachments && ticket.initial_attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ticket.initial_attachments.map((a, i) => (
                    <a
                      key={i}
                      href={publicFileUrl(a.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline"
                    >
                      {a.name || 'Attachment'}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col min-h-[420px]">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Public replies are visible to the tenant; internal notes are support-only.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <ScrollArea className="h-[320px] rounded-md border p-4">
                <div className="space-y-4 pr-4">
                  {(ticket.replies || []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No replies yet.</p>
                  )}
                  {(ticket.replies || []).map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-lg border p-3 text-sm ${
                        r.reply_type === 'internal'
                          ? 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
                          : 'bg-muted/40'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="font-medium">
                          {r.author_name}{' '}
                          <span className="text-muted-foreground font-normal">
                            · {r.author_kind === 'platform' ? 'Support' : 'Tenant'}
                          </span>
                          {r.reply_type === 'internal' && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                          {r.edited_at ? ' · edited' : ''}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{r.message}</p>
                      {r.attachments && r.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.attachments.map((a, i) => (
                            <a
                              key={i}
                              href={publicFileUrl(a.url)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary underline"
                            >
                              <Paperclip className="h-3 w-3" />
                              {a.name || 'File'}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            setEditReply(r)
                            setEditText(r.message)
                            setEditOpen(true)
                          }}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive"
                          onClick={() => setDeleteId(r.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <form onSubmit={sendReply} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="internal" checked={internal} onCheckedChange={setInternal} />
                    <Label htmlFor="internal">Internal note (not visible to tenant)</Label>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                    <span>Attach files</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </label>
                </div>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply… Use @name to mention teammates in the message text."
                  rows={4}
                />
                {files && files.length > 0 && (
                  <p className="text-xs text-muted-foreground">{files.length} file(s) selected</p>
                )}
                <div className="flex justify-end">
                  <Button type="submit" disabled={sending}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
              <CardDescription>Resolve and close follow your workflow rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {fmtStatus(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {status === 'resolved' && (
                <div className="space-y-2">
                  <Label>Resolution notes</Label>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                    placeholder="What was fixed?"
                  />
                </div>
              )}
              <Button type="button" className="w-full" onClick={saveStatus} disabled={statusSaving}>
                {statusSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update status'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment & escalation</CardTitle>
              <CardDescription>Route to an agent, team, or raise the escalation level.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                        {'email' in a && a.email ? ` · ${a.email}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not set</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Escalation level (1–3)</Label>
                <Select value={escalation} onValueChange={setEscalation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">L1 — Support agent</SelectItem>
                    <SelectItem value="2">L2 — Senior support</SelectItem>
                    <SelectItem value="3">L3 — System admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="secondary" className="w-full" onClick={saveAssign} disabled={assignSaving}>
                {assignSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save assignment'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SLA</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>
                Response due:{' '}
                {ticket.sla_response_due_at
                  ? format(new Date(ticket.sla_response_due_at), 'PPp')
                  : '—'}
              </p>
              <p>
                Resolution due:{' '}
                {ticket.sla_resolution_due_at
                  ? format(new Date(ticket.sla_resolution_due_at), 'PPp')
                  : '—'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit reply</DialogTitle>
          </DialogHeader>
          <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={5} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditReply}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this reply?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Only platform administrators can delete replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { supportApi } from '@/services/api/supportApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Tenant = { id: string; name: string; email: string }
type TenantUser = { id: string; name: string; email: string; role: string }

export default function NewSupportTicketPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [users, setUsers] = useState<TenantUser[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [tenantId, setTenantId] = useState('')
  const [requesterId, setRequesterId] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('technical')
  const [priority, setPriority] = useState('medium')
  const [team, setTeam] = useState('none')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/system/tenants')
        setTenants(res.data.data?.tenants ?? [])
      } catch {
        toast.error('Failed to load tenants')
      }
    })()
  }, [])

  useEffect(() => {
    if (!tenantId) {
      setUsers([])
      setRequesterId('')
      return
    }
    setLoadingUsers(true)
    ;(async () => {
      try {
        const res = await supportApi.getTenantUsers(tenantId)
        const list = res.data.data?.users ?? []
        setUsers(list)
        if (list.length && !requesterId) setRequesterId(list[0].id)
      } catch {
        toast.error('Failed to load tenant users')
        setUsers([])
      } finally {
        setLoadingUsers(false)
      }
    })()
  }, [tenantId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantId || !requesterId || !subject.trim() || !description.trim()) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await supportApi.createTicket({
        tenant_id: tenantId,
        raised_by_tenant_user_id: requesterId,
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
        team: team === 'none' ? undefined : team,
      })
      const id = res.data.data?.ticket?.id
      toast.success('Ticket created')
      if (id) router.push(`/systemadmin/support/${id}`)
      else router.push('/systemadmin/support')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/systemadmin/support" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New support ticket</h1>
          <p className="text-muted-foreground">Create a ticket on behalf of a tenant organization.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket details</CardTitle>
          <CardDescription>Select tenant, requester, and describe the issue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tenant *</Label>
                <Select value={tenantId} onValueChange={setTenantId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose cooperative" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Requester (tenant user) *</Label>
                <Select
                  value={requesterId}
                  onValueChange={setRequesterId}
                  disabled={!tenantId || loadingUsers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingUsers ? 'Loading users…' : 'Select user'} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description *</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="What should the support team know?"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team (optional)</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto" />
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
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/systemadmin/support">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  'Create ticket'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

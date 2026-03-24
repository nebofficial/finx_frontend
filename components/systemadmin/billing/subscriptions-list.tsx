'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreVertical, Eye, Edit } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { billingApi } from '@/services/api/billingApi'
import { getApiErrorMessage } from '@/lib/api-error'

interface Subscription {
  id: string
  tenant: string
  plan: string
  status: 'active' | 'expiring' | 'cancelled'
  nextRenewal: string
  mrr: number
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  expiring: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function SubscriptionsList() {
  const firstLoadRef = useRef(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await billingApi.getSubscriptions(statusFilter === 'all' ? undefined : { status: statusFilter })
      const mapped = (res.data.data.subscriptions || []).map((s: any) => ({
        id: s.id,
        tenant: s.tenant?.name || '-',
        plan: s.plan?.name || '-',
        status: s.status === 'pending' ? 'expiring' : s.status,
        nextRenewal: s.next_billing_date ? new Date(s.next_billing_date).toLocaleDateString() : '-',
        mrr: Number(s.amount || 0),
      }))
      setSubscriptions(mapped)
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to load subscriptions.')
      if (process.env.NODE_ENV === 'development') console.error('[SubscriptionsList] getSubscriptions failed:', err)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!firstLoadRef.current) {
      firstLoadRef.current = true
      void load()
      return
    }
    void load()
  }, [statusFilter])

  const cancelSubscription = async (id: string) => {
    try {
      await billingApi.updateSubscription(id, { status: 'cancelled', auto_renew: false })
      toast.success('Subscription updated')
      window.dispatchEvent(new CustomEvent('billing:data-changed'))
      await load()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update subscription.'))
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Active Subscriptions</CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? <p className="text-sm text-muted-foreground">Loading subscriptions…</p> : null}
          {!loading && subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscriptions found.</p>
          ) : null}
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-card-foreground">{sub.tenant}</h3>
                  <Badge className={statusColors[sub.status] || 'bg-slate-100 text-slate-800'}>
                    {sub.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{sub.plan} Plan</span>
                  <span>MRR: रू {sub.mrr}</span>
                  <span>Renews: {sub.nextRenewal}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye size={16} className="mr-2" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => cancelSubscription(sub.id)}>
                    <Edit size={16} className="mr-2" />
                    <span>Cancel Subscription</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

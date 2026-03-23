'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Bell, MessageSquare, Loader2 } from 'lucide-react'
import { tenantNotificationApi } from '@/services/api/tenantNotificationApi'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'
import { toast } from 'sonner'

type Activity = {
  id: string
  type: 'success' | 'warning' | 'neutral'
  title: string
  description: string
  time: string
  at: number
  icon: typeof Bell
}

function relTime(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ago`
  return d.toLocaleDateString()
}

export default function RecentActivity() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Activity[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [notifRes, ticketRes] = await Promise.all([
        tenantNotificationApi.list({ limit: 30 }),
        tenantSupportApi.list({ limit: 30 }),
      ])

      const notifications = (notifRes.data?.data?.notifications || []) as {
        id: string
        title?: string
        message?: string
        type?: string
        status?: string
        createdAt?: string
      }[]

      const tickets = (ticketRes.data?.data?.tickets || []) as {
        id: string
        subject?: string
        status?: string
        priority?: string
        createdAt?: string
      }[]

      const fromNotif: Activity[] = notifications.map((n) => ({
        id: `n-${n.id}`,
        type: n.status === 'failed' ? 'warning' : 'neutral',
        title: n.title || 'Notification',
        description: (n.message || '').slice(0, 120) + ((n.message?.length || 0) > 120 ? '…' : ''),
        time: relTime(n.createdAt),
        at: n.createdAt ? new Date(n.createdAt).getTime() : 0,
        icon: Bell,
      }))

      const fromTickets: Activity[] = tickets.map((t) => {
        const open = t.status === 'open' || t.status === 'in_progress'
        return {
          id: `t-${t.id}`,
          type: open ? 'warning' : 'success',
          title: t.status === 'resolved' || t.status === 'closed' ? 'Ticket resolved' : 'Support ticket',
          description: t.subject || t.id,
          time: relTime(t.createdAt),
          at: t.createdAt ? new Date(t.createdAt).getTime() : 0,
          icon: t.status === 'resolved' || t.status === 'closed' ? CheckCircle2 : MessageSquare,
        }
      })

      const merged = [...fromNotif, ...fromTickets].sort((a, b) => b.at - a.at)

      setItems(merged.slice(0, 8))
    } catch {
      toast.error('Failed to load recent activity.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const empty = useMemo(() => !loading && items.length === 0, [loading, items.length])

  return (
    <Card className="p-6 border-border">
      <h2 className="text-lg font-bold text-card-foreground mb-4">Recent activity</h2>
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : empty ? (
        <p className="text-sm text-muted-foreground py-4">No notifications or tickets yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((activity) => {
            const Icon = activity.icon
            const isWarning = activity.type === 'warning'
            const isNeutral = activity.type === 'neutral'

            return (
              <div key={activity.id} className="flex gap-3 pb-4 last:pb-0 border-b border-border last:border-0">
                <div
                  className={`mt-1 p-2 rounded-lg ${
                    isWarning ? 'bg-yellow-50' : isNeutral ? 'bg-muted' : 'bg-green-50'
                  }`}
                >
                  <Icon
                    className={
                      isWarning ? 'text-yellow-600' : isNeutral ? 'text-muted-foreground' : 'text-green-600'
                    }
                    size={16}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

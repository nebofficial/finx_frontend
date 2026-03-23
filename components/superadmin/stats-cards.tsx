'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Building2, Users, CreditCard, AlertCircle, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'
import { toast } from 'sonner'

export default function StatsCards() {
  const [loading, setLoading] = useState(true)
  const [orgName, setOrgName] = useState('—')
  const [userCount, setUserCount] = useState('—')
  const [subscriptionLabel, setSubscriptionLabel] = useState('—')
  const [openTickets, setOpenTickets] = useState('—')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [orgRes, usersRes, subRes, ticketsRes] = await Promise.allSettled([
        superAdminApi.getOrganization(),
        superAdminApi.listUsers({ page: 1, limit: 1 }),
        superAdminApi.getSubscription(),
        tenantSupportApi.list({ limit: 500 }),
      ])

      const org =
        orgRes.status === 'fulfilled' ? (orgRes.value.data?.data?.organization as { name?: string } | undefined) : undefined
      setOrgName(org?.name?.trim() || 'Your cooperative')

      const meta =
        usersRes.status === 'fulfilled' ? (usersRes.value.data?.data?.meta as { total?: number } | undefined) : undefined
      setUserCount(String(meta?.total ?? '—'))

      const sub =
        subRes.status === 'fulfilled'
          ? (subRes.value.data?.data?.subscription as
              | { status?: string; plan?: { name?: string } | null }
              | null
              | undefined)
          : undefined
      if (sub?.plan?.name) {
        setSubscriptionLabel(`${sub.plan.name} (${sub.status || 'active'})`)
      } else if (sub?.status) {
        setSubscriptionLabel(sub.status)
      } else {
        const ts =
          subRes.status === 'fulfilled' ? (subRes.value.data?.data?.tenant_status as string | undefined) : undefined
        setSubscriptionLabel(ts ? `Tenant: ${ts}` : 'No plan linked')
      }

      const tickets =
        ticketsRes.status === 'fulfilled' ? ((ticketsRes.value.data?.data?.tickets || []) as { status?: string }[]) : []
      const open = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length
      setOpenTickets(String(open))

      if (orgRes.status === 'rejected' || usersRes.status === 'rejected') {
        toast.error('Failed to load dashboard stats.')
      }
    } catch {
      toast.error('Failed to load dashboard stats.')
      setOrgName('—')
      setUserCount('—')
      setSubscriptionLabel('—')
      setOpenTickets('—')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = [
    {
      title: 'Cooperative',
      value: orgName,
      sub: 'Current tenant',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Users',
      value: userCount,
      sub: 'Total user accounts',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Subscription',
      value: subscriptionLabel,
      sub: 'Plan & status',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Open tickets',
      value: openTickets,
      sub: 'Open + in progress',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 col-span-full flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading stats…
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6 border-border">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                <p className="text-xl font-bold text-card-foreground mt-2 break-words">{stat.value}</p>
                <p className="text-muted-foreground text-xs mt-2">{stat.sub}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg flex-shrink-0`}>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

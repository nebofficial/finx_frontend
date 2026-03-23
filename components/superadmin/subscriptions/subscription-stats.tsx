'use client'

import { useCallback, useEffect, useState } from 'react'
import { differenceInDays } from 'date-fns'
import { Card } from '@/components/ui/card'
import { CreditCard, Clock, Users, TrendingUp, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'

export default function SubscriptionStats() {
  const [loading, setLoading] = useState(true)
  const [activeSub, setActiveSub] = useState(0)
  const [trialCount, setTrialCount] = useState(0)
  const [expiringSoon, setExpiringSoon] = useState(0)
  const [mrrLabel, setMrrLabel] = useState('—')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superAdminApi.getSubscription()
      const sub = res.data?.data?.subscription as
        | {
            status?: string
            amount?: string | number
            end_date?: string
            plan?: { price_monthly?: number }
          }
        | null
      const tenantStatus = String(res.data?.data?.tenant_status || '')

      const isActive = sub && ['active', 'trial', 'pending'].includes(String(sub.status || ''))
      setActiveSub(isActive ? 1 : 0)

      setTrialCount(tenantStatus === 'trial' ? 1 : 0)

      const end = sub?.end_date ? new Date(sub.end_date) : null
      if (end && !Number.isNaN(end.getTime())) {
        const d = differenceInDays(end, new Date())
        setExpiringSoon(d >= 0 && d <= 14 ? 1 : 0)
      } else {
        setExpiringSoon(0)
      }

      const amt = sub?.amount != null ? Number(sub.amount) : Number(sub?.plan?.price_monthly ?? 0)
      setMrrLabel(Number.isFinite(amt) ? `$${amt.toFixed(2)}/mo` : '—')
    } catch {
      setActiveSub(0)
      setTrialCount(0)
      setExpiringSoon(0)
      setMrrLabel('—')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 py-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading subscription stats…
      </div>
    )
  }

  const stats = [
    {
      title: 'Active subscription',
      value: String(activeSub),
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Trial tenant',
      value: String(trialCount),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Renewal within 14 days',
      value: String(expiringSoon),
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Subscription amount',
      value: mrrLabel,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`${stat.color}`} size={24} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

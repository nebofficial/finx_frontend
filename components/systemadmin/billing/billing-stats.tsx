'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'
import { billingApi } from '@/services/api/billingApi'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'

export default function BillingStats() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState([
    { title: 'Total Revenue (MRR)', value: 'रू 0', change: 'Live platform data', icon: <DollarSign className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Active Subscriptions', value: '0', change: 'Live platform data', icon: <Users className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Pending Revenue', value: 'रू 0', change: 'Live platform data', icon: <TrendingUp className="w-6 h-6" />, color: 'text-yellow-600' },
    { title: 'Total Tenants', value: '0', change: 'Live platform data', icon: <Calendar className="w-6 h-6" />, color: 'text-red-600' },
  ])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await billingApi.getAnalytics()
        const data = res?.data?.data?.stats || {}
        if (!mounted) return
        setStats([
          { title: 'Total Revenue (MRR)', value: `रू ${Number(data.mrr || 0).toFixed(2)}`, change: 'Collected revenue', icon: <DollarSign className="w-6 h-6" />, color: 'text-green-600' },
          { title: 'Active Subscriptions', value: String(data.active_subscriptions || 0), change: 'Currently active', icon: <Users className="w-6 h-6" />, color: 'text-blue-600' },
          { title: 'Pending Revenue', value: `रू ${Number(data.pending_revenue || 0).toFixed(2)}`, change: 'Awaiting collection', icon: <TrendingUp className="w-6 h-6" />, color: 'text-yellow-600' },
          { title: 'Total Tenants', value: String(data.total_tenants || 0), change: 'Platform cooperatives', icon: <Calendar className="w-6 h-6" />, color: 'text-red-600' },
        ])
      } catch (err) {
        const msg = getApiErrorMessage(err, 'Failed to load billing analytics.')
        if (process.env.NODE_ENV === 'development') console.error('[BillingStats] getAnalytics failed:', err)
        if (mounted) setError(msg)
        toast.error(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    const onBillingChange = () => { void load() }
    window.addEventListener('billing:data-changed', onBillingChange)
    return () => {
      mounted = false
      window.removeEventListener('billing:data-changed', onBillingChange)
    }
  }, [])

  return (
    <div className="space-y-3">
      {loading ? <p className="text-sm text-muted-foreground">Loading billing stats…</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color}`}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  )
}

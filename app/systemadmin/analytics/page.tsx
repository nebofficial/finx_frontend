'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import AnalyticsCharts from '@/components/systemadmin/analytics/analytics-charts'
import AnalyticsMetrics from '@/components/systemadmin/analytics/analytics-metrics'
import UserGrowthChart from '@/components/systemadmin/analytics/user-growth-chart'
import ConversionFunnel from '@/components/systemadmin/analytics/conversion-funnel'
import { billingApi } from '@/services/api/billingApi'

export type PlatformAnalyticsBundle = {
  stats?: {
    mrr?: number
    active_subscriptions?: number
    pending_revenue?: number
    total_tenants?: number
  }
  revenue_trend?: { month: string; revenue: number }[]
  plan_distribution?: { plan: string; count: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<PlatformAnalyticsBundle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await billingApi.getAnalytics()
        if (!mounted) return
        setData(res.data?.data ?? {})
      } catch {
        if (mounted) setData({})
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Billing and tenant metrics from the platform database</p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics…
        </p>
      )}

      <AnalyticsMetrics stats={data?.stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts revenueTrend={data?.revenue_trend} loading={loading} />
        <UserGrowthChart revenueTrend={data?.revenue_trend} loading={loading} />
      </div>

      <ConversionFunnel planDistribution={data?.plan_distribution} loading={loading} />
    </div>
  )
}

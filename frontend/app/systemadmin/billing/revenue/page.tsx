'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react'
import { billingApi } from '@/services/api/billingApi'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'

export default function RevenueAnalyticsPage() {
  const hasLoadedRef = useRef(false)
  const [stats, setStats] = useState({ mrr: 0, active_subscriptions: 0, total_tenants: 0 })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [planRevenue, setPlanRevenue] = useState<any[]>([])

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    const load = async () => {
      try {
        const res = await billingApi.getAnalytics()
        const data = res.data.data
        setStats(data.stats || { mrr: 0, active_subscriptions: 0, total_tenants: 0 })
        setRevenueData((data.revenue_trend || []).map((x: any, idx: number) => ({
          month: x.month,
          revenue: Number(x.revenue || 0),
          target: Number(x.revenue || 0) * 1.1,
          growth: idx === 0 ? 0 : (((Number(x.revenue || 0) - Number((data.revenue_trend[idx - 1]?.revenue || 0))) / Math.max(1, Number(data.revenue_trend[idx - 1]?.revenue || 1))) * 100).toFixed(0),
        })))
        const dist = data.plan_distribution || []
        const total = dist.reduce((s: number, d: any) => s + Number(d.count || 0), 0)
        setPlanRevenue(dist.map((d: any) => ({
          name: d.plan,
          value: Number(d.count || 0),
          percentage: total ? Math.round((Number(d.count || 0) / total) * 100) : 0,
        })))
      } catch (err: unknown) {
        const msg = getApiErrorMessage(err, 'Failed to load revenue analytics.')
        if (process.env.NODE_ENV === 'development') console.error('[RevenueAnalytics] getAnalytics failed:', err)
        toast.error(msg)
      }
    }
    void load()
    const onBillingChange = () => { void load() }
    window.addEventListener('billing:data-changed', onBillingChange)
    return () => window.removeEventListener('billing:data-changed', onBillingChange)
  }, [])

  const COLORS = ['#00AA00', '#FFD700', '#2196F3']

  const metrics = useMemo(() => [
    {
      label: 'Monthly Recurring Revenue',
      value: `$${Number(stats.mrr || 0).toFixed(2)}`,
      change: 'Live',
      icon: DollarSign,
      color: 'bg-green-100',
    },
    {
      label: 'Annual Revenue Run Rate',
      value: `$${(Number(stats.mrr || 0) * 12).toFixed(2)}`,
      change: 'Live',
      icon: TrendingUp,
      color: 'bg-blue-100',
    },
    {
      label: 'Paid Tenants',
      value: String(stats.active_subscriptions || 0),
      change: 'Live',
      icon: Users,
      color: 'bg-yellow-100',
    },
    {
      label: 'Avg Revenue per Tenant',
      value: `$${stats.total_tenants ? (Number(stats.mrr || 0) / stats.total_tenants).toFixed(2) : '0.00'}`,
      change: 'Live',
      icon: ShoppingCart,
      color: 'bg-purple-100',
    },
  ], [stats])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Revenue Analytics</h1>
        <p className="text-muted-foreground mt-2">Monitor revenue metrics and growth trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{metric.value}</p>
                  <p className="text-xs text-success mt-2">{metric.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="w-6 h-6 text-card-foreground" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Revenue Trends */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Revenue Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#00AA00" strokeWidth={2} name="Actual Revenue" />
            <Line type="monotone" dataKey="target" stroke="#FFD700" strokeWidth={2} strokeDasharray="5 5" name="Target Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Revenue by Plan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Growth Rate */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Growth Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="growth" fill="#00AA00" name="Growth %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Churn & Retention */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Churn & Retention Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Churn Rate', value: '2.3%', trend: 'down' },
            { label: 'Retention Rate', value: '97.7%', trend: 'up' },
            { label: 'NRR (Net Revenue Retention)', value: '118%', trend: 'up' },
            { label: 'LTV:CAC Ratio', value: '4.2:1', trend: 'up' },
          ].map((metric) => (
            <div key={metric.label} className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs mb-2">{metric.label}</p>
              <p className="text-2xl font-bold text-card-foreground mb-1">{metric.value}</p>
              <p className={`text-xs ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {metric.trend === 'up' ? '↑' : '↓'} {metric.trend === 'up' ? 'Improving' : 'Decreasing'}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Revenue Tenants */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Top Revenue Tenants</h2>
        <div className="space-y-2">
          {[
            { name: 'Acme Corporation', mrr: '$2,450', plan: 'Enterprise', growth: '+12%' },
            { name: 'Global Solutions Ltd', mrr: '$2,050', plan: 'Enterprise', growth: '+18%' },
            { name: 'Tech Startup Inc', mrr: '$450', plan: 'Professional', growth: '+8%' },
            { name: 'DataCorp Inc', mrr: '$890', plan: 'Enterprise', growth: '+25%' },
            { name: 'Innovation Labs', mrr: '$420', plan: 'Professional', growth: '+5%' },
          ].map((tenant, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-muted transition-colors">
              <div>
                <p className="text-sm font-medium text-card-foreground">{tenant.name}</p>
                <p className="text-xs text-muted-foreground">{tenant.plan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-card-foreground">{tenant.mrr}</p>
                <p className="text-xs text-success">{tenant.growth}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

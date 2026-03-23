'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { superAdminApi } from '@/services/api/superAdminApi'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function lastNMonthKeys(n: number) {
  const out: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push({ key: monthKey(d), label: MONTHS[d.getMonth()] })
  }
  return out
}

export default function MetricsChart() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ month: string; users: number; tickets: number }[]>([])

  const keys = useMemo(() => lastNMonthKeys(6), [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, ticketsRes] = await Promise.all([
        superAdminApi.listUsers({ page: 1, limit: 500 }),
        tenantSupportApi.list({ limit: 500 }),
      ])

      const users = (usersRes.data?.data?.users || []) as { createdAt?: string }[]
      const tickets = (ticketsRes.data?.data?.tickets || []) as { createdAt?: string }[]

      const userByMonth: Record<string, number> = {}
      const ticketByMonth: Record<string, number> = {}
      for (const k of keys) {
        userByMonth[k.key] = 0
        ticketByMonth[k.key] = 0
      }

      for (const u of users) {
        if (!u.createdAt) continue
        const k = monthKey(new Date(u.createdAt))
        if (userByMonth[k] !== undefined) userByMonth[k] += 1
      }
      for (const t of tickets) {
        if (!t.createdAt) continue
        const k = monthKey(new Date(t.createdAt))
        if (ticketByMonth[k] !== undefined) ticketByMonth[k] += 1
      }

      setData(
        keys.map((k) => ({
          month: k.label,
          users: userByMonth[k.key] || 0,
          tickets: ticketByMonth[k.key] || 0,
        }))
      )
    } catch {
      toast.error('Failed to load chart data.')
      setData(keys.map((k) => ({ month: k.label, users: 0, tickets: 0 })))
    } finally {
      setLoading(false)
    }
  }, [keys])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <Card className="p-6 border-border">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-card-foreground">Activity (last 6 months)</h2>
        <p className="text-sm text-muted-foreground mt-1">New users and support tickets by month</p>
      </div>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading chart…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="users" name="Users added" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="tickets" name="Tickets opened" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

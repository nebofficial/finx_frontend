'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle, Clock, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react'
import { tenantSupportApi } from '@/services/api/tenantSupportApi'

type TicketRow = { status?: string }

export default function SupportStats() {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(0)
  const [inProgress, setInProgress] = useState(0)
  const [resolved, setResolved] = useState(0)
  const [total, setTotal] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tenantSupportApi.list({ limit: 500 })
      const tickets = (res.data?.data?.tickets || []) as TicketRow[]
      setTotal(tickets.length)
      setOpen(tickets.filter((t) => t.status === 'open').length)
      setInProgress(tickets.filter((t) => t.status === 'in_progress').length)
      setResolved(tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length)
    } catch {
      setTotal(0)
      setOpen(0)
      setInProgress(0)
      setResolved(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = [
    { title: 'Open', value: String(open), icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { title: 'In progress', value: String(inProgress), icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Resolved / closed', value: String(resolved), icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Total (loaded)', value: String(total), icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  ]

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 py-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading ticket stats…
      </div>
    )
  }

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

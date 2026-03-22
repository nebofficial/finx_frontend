'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, Clock, CheckCircle2, MessageSquare } from 'lucide-react'

const stats = [
  {
    title: 'Open Tickets',
    value: '12',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'In Progress',
    value: '8',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Resolved Today',
    value: '5',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Avg Response Time',
    value: '2.4h',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
]

export default function SupportStats() {
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

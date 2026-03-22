'use client'

import { Card } from '@/components/ui/card'
import { Bell, Mail, MessageSquare, CheckCircle2 } from 'lucide-react'

const stats = [
  {
    title: 'Sent This Month',
    value: '342',
    icon: Bell,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Delivery Rate',
    value: '94.2%',
    icon: Mail,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Active Alerts',
    value: '5',
    icon: MessageSquare,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Failed Deliveries',
    value: '8',
    icon: CheckCircle2,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
]

export default function NotificationStats() {
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

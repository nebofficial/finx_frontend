'use client'

import { Card } from '@/components/ui/card'
import { CreditCard, Clock, Users, TrendingUp } from 'lucide-react'

const stats = [
  {
    title: 'Active Subscriptions',
    value: '98',
    icon: CreditCard,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Active Trials',
    value: '23',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Expiring Soon',
    value: '8',
    icon: Users,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Monthly Revenue',
    value: '$48.5K',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
]

export default function SubscriptionStats() {
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

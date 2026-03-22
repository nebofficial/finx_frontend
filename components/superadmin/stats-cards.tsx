'use client'

import { Card } from '@/components/ui/card'
import { Building2, Users, CreditCard, AlertCircle } from 'lucide-react'

const stats = [
  {
    title: 'Active Organizations',
    value: '128',
    change: '+5%',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Total Users',
    value: '3,542',
    change: '+12%',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Active Subscriptions',
    value: '98',
    change: '+3%',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'System Alerts',
    value: '4',
    change: '-1%',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
]

export default function StatsCards() {
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
                <p className="text-green-600 text-xs font-medium mt-2">{stat.change} from last month</p>
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

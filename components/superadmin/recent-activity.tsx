'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, UserPlus, CreditCard } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'success',
    title: 'New organization added',
    description: 'Green Valley Coop',
    time: '2 minutes ago',
    icon: UserPlus
  },
  {
    id: 2,
    type: 'warning',
    title: 'Trial ending soon',
    description: 'Urban Farmers Coop (5 days left)',
    time: '1 hour ago',
    icon: AlertCircle
  },
  {
    id: 3,
    type: 'success',
    title: 'Subscription upgraded',
    description: 'Mountain Ridge Coop → Premium',
    time: '4 hours ago',
    icon: CreditCard
  },
  {
    id: 4,
    type: 'success',
    title: 'Support ticket resolved',
    description: 'Ticket #2847 closed',
    time: '6 hours ago',
    icon: CheckCircle2
  },
]

export default function RecentActivity() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          const isWarning = activity.type === 'warning'
          
          return (
            <div key={activity.id} className="flex gap-3 pb-4 last:pb-0 border-b last:border-0">
              <div className={`mt-1 p-2 rounded-lg ${isWarning ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <Icon className={`${isWarning ? 'text-yellow-600' : 'text-green-600'}`} size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, User, CreditCard, Building2 } from 'lucide-react'

const activities = [
  {
    id: '1',
    type: 'success',
    title: 'Organization Created',
    description: 'Tech Innovations Lab was added to the system',
    timestamp: '2024-03-15T14:32:00Z',
    icon: Building2,
    user: 'admin@system.local'
  },
  {
    id: '2',
    type: 'success',
    title: 'Subscription Upgraded',
    description: 'Green Valley Coop upgraded from Starter to Premium',
    timestamp: '2024-03-15T13:15:30Z',
    icon: CreditCard,
    user: 'support@system.local'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Failed Login Attempts',
    description: '3 failed login attempts detected from Riverside Farm Coop',
    timestamp: '2024-03-15T10:05:20Z',
    icon: AlertCircle,
    user: 'System'
  },
  {
    id: '4',
    type: 'success',
    title: 'Admin Changed',
    description: 'New administrator assigned to Urban Farmers Coop',
    timestamp: '2024-03-15T09:20:15Z',
    icon: User,
    user: 'admin@system.local'
  },
]

export default function ActivityTimeline() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Activity Timeline</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          const isWarning = activity.type === 'warning'
          
          return (
            <div key={activity.id} className="flex gap-4">
              <div className="relative">
                <div className={`p-2 rounded-full ${isWarning ? 'bg-yellow-50' : 'bg-green-50'}`}>
                  <Icon className={isWarning ? 'text-yellow-600' : 'text-green-600'} size={20} />
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-2">By: {activity.user}</p>
                  </div>
                  <Badge className={isWarning ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {isWarning ? 'Warning' : 'Success'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

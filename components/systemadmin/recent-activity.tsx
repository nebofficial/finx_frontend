import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Activity {
  id: string
  action: string
  actor: string
  target: string
  timestamp: string
  status: 'success' | 'pending' | 'error'
}

const activities: Activity[] = [
  {
    id: '1',
    action: 'User Created',
    actor: 'Admin',
    target: 'john@example.com',
    timestamp: '2 hours ago',
    status: 'success',
  },
  {
    id: '2',
    action: 'Tenant Updated',
    actor: 'Manager',
    target: 'Acme Corp',
    timestamp: '4 hours ago',
    status: 'success',
  },
  {
    id: '3',
    action: 'Subscription Downgrade',
    actor: 'System',
    target: 'Premium Plan',
    timestamp: '6 hours ago',
    status: 'pending',
  },
  {
    id: '4',
    action: 'API Key Revoked',
    actor: 'Owner',
    target: 'api_key_123',
    timestamp: '1 day ago',
    status: 'success',
  },
  {
    id: '5',
    action: 'Failed Login Attempt',
    actor: 'Unknown',
    target: 'admin@example.com',
    timestamp: '2 days ago',
    status: 'error',
  },
]

const statusColors = {
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
}

export default function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.actor} • {activity.target}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge className={`whitespace-nowrap ${statusColors[activity.status]}`}>
                  {activity.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

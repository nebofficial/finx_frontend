'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'active' | 'failed'
  lastAttempt: string
}

const webhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://api.example.com/webhooks/payment',
    events: ['payment.created', 'payment.completed'],
    status: 'active',
    lastAttempt: '5 minutes ago',
  },
  {
    id: '2',
    url: 'https://api.example.com/webhooks/user',
    events: ['user.created', 'user.deleted'],
    status: 'active',
    lastAttempt: '2 hours ago',
  },
  {
    id: '3',
    url: 'https://api.example.com/webhooks/tenant',
    events: ['tenant.updated'],
    status: 'failed',
    lastAttempt: '1 hour ago',
  },
]

export default function Webhooks() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Webhooks</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage webhook integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {webhooks.map((webhook) => (
          <div
            key={webhook.id}
            className="p-4 border border-border rounded-lg space-y-3 hover:bg-muted/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {webhook.status === 'active' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <AlertCircle size={16} className="text-red-600" />
                  )}
                  <code className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
                    {webhook.url}
                  </code>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {webhook.events.map((event) => (
                    <Badge key={event} className="bg-blue-100 text-blue-800 text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Status: {webhook.status} • Last attempt: {webhook.lastAttempt}
            </div>
          </div>
        ))}

        <Button className="w-full bg-primary hover:bg-green-700 text-primary-foreground">
          Add Webhook
        </Button>
      </CardContent>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Plus, Trash2, Eye, RotateCcw } from 'lucide-react'

export default function WebhooksPage() {
  const webhooks = [
    {
      id: 'wh_123456',
      name: 'Subscription Events',
      url: 'https://api.example.com/webhooks/subscriptions',
      events: ['subscription.created', 'subscription.updated', 'subscription.cancelled'],
      active: true,
      createdAt: 'Jan 10, 2024',
      lastTriggered: '2 minutes ago',
      deliveryRate: '99.8%',
    },
    {
      id: 'wh_789012',
      name: 'User Events',
      url: 'https://api.example.com/webhooks/users',
      events: ['user.created', 'user.updated', 'user.deleted'],
      active: true,
      createdAt: 'Jan 5, 2024',
      lastTriggered: '5 minutes ago',
      deliveryRate: '99.9%',
    },
    {
      id: 'wh_345678',
      name: 'Payment Events',
      url: 'https://api.example.com/webhooks/payments',
      events: ['payment.succeeded', 'payment.failed', 'refund.created'],
      active: false,
      createdAt: 'Dec 20, 2023',
      lastTriggered: '3 hours ago',
      deliveryRate: '98.5%',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Webhooks</h1>
          <p className="text-muted-foreground mt-2">Configure webhooks for system events</p>
        </div>
        <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Webhook Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Create New Webhook</h2>
        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Webhook Name</FieldLabel>
              <Input placeholder="e.g., Subscription Events" className="bg-white border-input-border" />
            </Field>
            <Field>
              <FieldLabel>Webhook URL</FieldLabel>
              <Input placeholder="https://api.example.com/webhooks" className="bg-white border-input-border" />
            </Field>
            <Field>
              <FieldLabel>Events</FieldLabel>
              <div className="space-y-2">
                {['subscription.created', 'subscription.updated', 'subscription.cancelled', 'user.created', 'payment.succeeded'].map((event) => (
                  <label key={event} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-sm text-card-foreground">{event}</span>
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
            Create Webhook
          </Button>
        </div>
      </Card>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-card-foreground">{webhook.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${webhook.active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800'}`}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-card-foreground mb-2">Events:</p>
              <div className="flex flex-wrap gap-2">
                {webhook.events.map((event) => (
                  <span key={event} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {event}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium text-card-foreground">{webhook.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Triggered</p>
                <p className="text-sm font-medium text-card-foreground">{webhook.lastTriggered}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Delivery Rate</p>
                <p className="text-sm font-medium text-success">{webhook.deliveryRate}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button className="text-card-foreground border border-border-light bg-white hover:bg-muted">
                <RotateCcw className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button className="text-card-foreground border border-border-light bg-white hover:bg-muted">
                <Eye className="w-4 h-4 mr-2" />
                Logs
              </Button>
              <Button className="text-destructive border border-border-light bg-white hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Documentation */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Webhook Events</h2>
        <div className="space-y-3">
          <p className="text-sm text-card-foreground">
            Learn about available webhook events and how to handle them in our documentation:
          </p>
          <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
            View Webhook Documentation
          </Button>
        </div>
      </Card>
    </div>
  )
}

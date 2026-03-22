'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function RateLimitingPage() {
  const rateLimits = [
    {
      id: 1,
      name: 'Default API Limit',
      requestsPerMinute: '1000',
      requestsPerHour: '50000',
      burstLimit: '100',
      status: 'active',
    },
    {
      id: 2,
      name: 'Enterprise Limit',
      requestsPerMinute: '10000',
      requestsPerHour: '500000',
      burstLimit: '1000',
      status: 'active',
    },
    {
      id: 3,
      name: 'Trial Limit',
      requestsPerMinute: '100',
      requestsPerHour: '5000',
      burstLimit: '10',
      status: 'active',
    },
  ]

  const tenantLimits = [
    { tenant: 'Acme Corporation', limit: 'Enterprise', usage: '87%' },
    { tenant: 'Tech Startup Inc', limit: 'Default', usage: '45%' },
    { tenant: 'Global Solutions', limit: 'Enterprise', usage: '92%' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Rate Limiting</h1>
          <p className="text-muted-foreground mt-2">Configure API rate limits and throttling</p>
        </div>
        <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Create New Limit
        </Button>
      </div>

      {/* Create Rate Limit */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Create Rate Limit Configuration</h2>
        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Configuration Name</FieldLabel>
              <Input placeholder="e.g., Premium Plan Limit" className="bg-white border-input-border" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Requests per Minute</FieldLabel>
                <Input type="number" placeholder="1000" className="bg-white border-input-border" />
              </Field>
              <Field>
                <FieldLabel>Requests per Hour</FieldLabel>
                <Input type="number" placeholder="50000" className="bg-white border-input-border" />
              </Field>
              <Field>
                <FieldLabel>Burst Limit</FieldLabel>
                <Input type="number" placeholder="100" className="bg-white border-input-border" />
              </Field>
            </div>
          </FieldGroup>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
            Create Configuration
          </Button>
        </div>
      </Card>

      {/* Rate Limit Configs */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Rate Limit Configurations</h2>
        <div className="space-y-3">
          {rateLimits.map((limit) => (
            <div key={limit.id} className="flex items-start justify-between p-4 border border-border-light rounded-lg hover:bg-muted transition-colors">
              <div>
                <h3 className="font-semibold text-card-foreground">{limit.name}</h3>
                <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs opacity-75">Requests/Min</p>
                    <p className="font-medium text-card-foreground">{limit.requestsPerMinute}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Requests/Hour</p>
                    <p className="font-medium text-card-foreground">{limit.requestsPerHour}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Burst Limit</p>
                    <p className="font-medium text-card-foreground">{limit.burstLimit}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="h-8 text-xs text-card-foreground bg-white hover:bg-muted border border-border-light">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button className="h-8 text-xs text-destructive bg-white hover:bg-red-50 border border-border-light">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tenant Rate Limits */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Tenant Rate Limit Usage</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Rate Limit Tier</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Current Usage</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenantLimits.map((item, idx) => {
                const usage = parseFloat(item.usage)
                const statusColor = usage > 90 ? 'bg-red-100 text-red-800' : usage > 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                return (
                  <tr key={idx} className="border-b border-border-light hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-card-foreground">{item.tenant}</td>
                    <td className="py-3 px-4 text-sm text-card-foreground">{item.limit}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className={`h-2 rounded-full ${usage > 90 ? 'bg-red-600' : usage > 75 ? 'bg-yellow-600' : 'bg-success'}`}
                            style={{ width: `${usage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-card-foreground w-12">{item.usage}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${statusColor}`}>
                        {usage > 90 ? 'High' : usage > 75 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Throttling Rules */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Throttling Rules</h2>
        <div className="space-y-3">
          {[
            { rule: 'If request rate exceeds burst limit', action: 'Return 429 Too Many Requests' },
            { rule: 'If hourly limit reached', action: 'Throttle to 10% capacity' },
            { rule: 'If repeated violations', action: 'Temporary IP block (1 hour)' },
            { rule: 'If suspicious patterns detected', action: 'Require CAPTCHA' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 border border-border-light rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-card-foreground">{item.rule}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

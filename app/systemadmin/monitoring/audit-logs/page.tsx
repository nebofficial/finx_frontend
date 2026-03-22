'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Filter, Download, Search } from 'lucide-react'
import { useState } from 'react'

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const logs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:35:22',
      userId: 'admin@saas.com',
      action: 'TENANT_CREATED',
      resource: 'Tenant: Acme Corp',
      status: 'success',
      details: 'New tenant provisioned with Enterprise plan',
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:30:15',
      userId: 'user@techstartup.com',
      action: 'USER_LOGIN',
      resource: 'User Authentication',
      status: 'success',
      details: 'User logged in from IP 192.168.1.100',
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:25:48',
      userId: 'admin@saas.com',
      action: 'BILLING_PLAN_CHANGE',
      resource: 'Subscription: Tech Startup',
      status: 'success',
      details: 'Plan upgraded from Basic to Premium',
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:30',
      userId: 'unknown',
      action: 'LOGIN_FAILED',
      resource: 'User Authentication',
      status: 'failure',
      details: 'Failed login attempt with invalid credentials',
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:10:12',
      userId: 'admin@saas.com',
      action: 'USER_ROLE_CHANGED',
      resource: 'User: john@acme.com',
      status: 'success',
      details: 'Role changed from User to Manager',
    },
    {
      id: 6,
      timestamp: '2024-01-15 14:05:45',
      userId: 'admin@saas.com',
      action: 'API_KEY_CREATED',
      resource: 'API Integration',
      status: 'success',
      details: 'New API key generated for Acme Corp',
    },
    {
      id: 7,
      timestamp: '2024-01-15 13:55:20',
      userId: 'admin@saas.com',
      action: 'DATA_EXPORT',
      resource: 'Tenant Data: Global Solutions',
      status: 'success',
      details: 'Exported user data in CSV format',
    },
    {
      id: 8,
      timestamp: '2024-01-15 13:45:10',
      userId: 'user@creative.com',
      action: 'PASSWORD_CHANGED',
      resource: 'User: user@creative.com',
      status: 'success',
      details: 'Password successfully changed',
    },
    {
      id: 9,
      timestamp: '2024-01-15 13:30:55',
      userId: 'admin@saas.com',
      action: 'TENANT_SUSPENDED',
      resource: 'Tenant: Legacy Systems',
      status: 'success',
      details: 'Tenant suspended due to payment failure',
    },
    {
      id: 10,
      timestamp: '2024-01-15 13:20:33',
      userId: 'unknown',
      action: 'SUSPICIOUS_LOGIN',
      resource: 'Security Alert',
      status: 'warning',
      details: 'Unusual login attempt from new location',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success'
      case 'failure':
        return 'bg-destructive/10 text-destructive'
      case 'warning':
        return 'bg-warning/10 text-warning'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-blue-100 text-blue-800'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
    if (action.includes('CHANGE')) return 'bg-yellow-100 text-yellow-800'
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'bg-green-100 text-green-800'
    if (action.includes('SUSPEND')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">Track all system activities and user actions</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by user, action, or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-input-border"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Resource</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border-light hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-card-foreground">{log.timestamp}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground font-medium">{log.userId}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{log.resource}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(log.status)}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 10 of 2,847 entries</p>
          <div className="flex gap-2">
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              Previous
            </Button>
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

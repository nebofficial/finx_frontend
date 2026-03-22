'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const mockAlerts = [
  {
    id: '1',
    type: 'suspicious-login',
    title: 'Suspicious Login Detected',
    description: 'Multiple failed login attempts from 203.0.113.45 targeting user@riverside.coop',
    organization: 'Riverside Farm Coop',
    severity: 'high',
    timestamp: '2024-03-15T10:05:00Z',
    status: 'active'
  },
  {
    id: '2',
    type: 'unusual-activity',
    title: 'Unusual Activity Pattern',
    description: 'Large data export detected from admin account at 2:30 AM',
    organization: 'Green Valley Coop',
    severity: 'medium',
    timestamp: '2024-03-15T02:30:00Z',
    status: 'investigating'
  },
  {
    id: '3',
    type: 'access-change',
    title: 'Unauthorized Access Attempt',
    description: 'Attempt to access restricted API endpoints with invalid token',
    organization: 'Urban Farmers Coop',
    severity: 'high',
    timestamp: '2024-03-14T16:45:00Z',
    status: 'resolved'
  },
]

export default function SecurityAlerts() {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {mockAlerts.map((alert) => (
        <Card key={alert.id} className={`p-4 border-l-4 ${
          alert.severity === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded ${
              alert.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              <AlertTriangle className={alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'} size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-gray-600">{alert.organization}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge className={
                    alert.status === 'active' ? 'bg-red-100 text-red-800' :
                    alert.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {alert.status === 'active' && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                    Block User
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

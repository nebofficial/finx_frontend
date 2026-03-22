'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, Server, Database, Mail, Activity } from 'lucide-react'

const healthMetrics = [
  {
    name: 'API Server',
    status: 'healthy',
    uptime: '99.95%',
    responseTime: '45ms',
    icon: Server
  },
  {
    name: 'Database',
    status: 'healthy',
    uptime: '100%',
    responseTime: '12ms',
    icon: Database
  },
  {
    name: 'Email Service',
    status: 'healthy',
    uptime: '99.8%',
    responseTime: '250ms',
    icon: Mail
  },
  {
    name: 'System Load',
    status: 'warning',
    uptime: 'CPU: 62% | RAM: 78%',
    responseTime: 'Normal',
    icon: Activity
  },
]

export default function SystemHealthStatus() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">System Health Status</h2>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 size={14} />
            All Systems Operational
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon
            const isHealthy = metric.status === 'healthy'
            
            return (
              <div key={metric.name} className={`p-4 rounded-lg border ${
                isHealthy ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded ${isHealthy ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Icon className={isHealthy ? 'text-green-600' : 'text-yellow-600'} size={20} />
                  </div>
                  {isHealthy ? (
                    <CheckCircle2 className="text-green-600" size={16} />
                  ) : (
                    <AlertTriangle className="text-yellow-600" size={16} />
                  )}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{metric.name}</p>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-medium">Uptime:</span> {metric.uptime}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Response:</span> {metric.responseTime}
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Latest System Events</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b">
            <CheckCircle2 className="text-green-600 mt-1" size={16} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Database Backup Completed</p>
              <p className="text-xs text-gray-500">2024-03-15 02:30 UTC</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b">
            <CheckCircle2 className="text-green-600 mt-1" size={16} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Security Scan Completed</p>
              <p className="text-xs text-gray-500">2024-03-14 23:15 UTC</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 mt-1" size={16} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">High System Load Detected</p>
              <p className="text-xs text-gray-500">2024-03-14 18:45 UTC - CPU 85%, Memory 92%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

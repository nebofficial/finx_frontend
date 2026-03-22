'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  Server,
  Database,
  Activity
} from 'lucide-react'

export default function SystemAdminPage() {
  const stats = [
    {
      icon: Building2,
      label: 'Total Tenants',
      value: '156',
      change: '+12%',
      color: 'bg-blue-100'
    },
    {
      icon: Users,
      label: 'Total Users',
      value: '2,847',
      change: '+23%',
      color: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Monthly Revenue',
      value: '$47,293',
      change: '+18%',
      color: 'bg-yellow-100'
    },
    {
      icon: AlertCircle,
      label: 'Active Alerts',
      value: '3',
      change: '-2',
      color: 'bg-red-100'
    },
  ]

  const systemHealth = [
    { name: 'API Servers', status: 'healthy', uptime: '99.98%' },
    { name: 'Database', status: 'healthy', uptime: '99.99%' },
    { name: 'Cache Layer', status: 'healthy', uptime: '99.95%' },
    { name: 'Storage', status: 'warning', uptime: '95%' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-2">System-wide metrics and health status</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-card-foreground" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card className="lg:col-span-1 p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">System Health</h2>
          <div className="space-y-3">
            {systemHealth.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      system.status === 'healthy' ? 'bg-green' : 'bg-yellow'
                    }`}
                  />
                  <span className="text-sm font-medium text-card-foreground">{system.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{system.uptime}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <Server className="w-4 h-4 mr-2" />
              View Infrastructure
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <Database className="w-4 h-4 mr-2" />
              Database Health
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <Activity className="w-4 h-4 mr-2" />
              Performance Metrics
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent System Events</h2>
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', event: 'Storage usage alert triggered', type: 'warning' },
            { time: '15 minutes ago', event: 'New tenant provisioned: Acme Corp', type: 'success' },
            { time: '1 hour ago', event: 'Database backup completed', type: 'success' },
            { time: '2 hours ago', event: 'API rate limit exceeded for tenant ABC123', type: 'warning' },
            { time: '3 hours ago', event: 'System patch deployed successfully', type: 'success' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 border border-border-light rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'success' ? 'bg-success' : 'bg-warning'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

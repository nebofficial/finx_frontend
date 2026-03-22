'use client'

import { Card } from '@/components/ui/card'
import { Activity, Server, Database, Network, Zap, HardDrive } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function SystemStatusPage() {
  const cpuData = [
    { time: '12:00', value: 45 },
    { time: '12:15', value: 52 },
    { time: '12:30', value: 48 },
    { time: '12:45', value: 61 },
    { time: '13:00', value: 55 },
    { time: '13:15', value: 67 },
    { time: '13:30', value: 70 },
  ]

  const memoryData = [
    { time: '12:00', value: 62 },
    { time: '12:15', value: 65 },
    { time: '12:30', value: 68 },
    { time: '12:45', value: 71 },
    { time: '13:00', value: 69 },
    { time: '13:15', value: 73 },
    { time: '13:30', value: 76 },
  ]

  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.98%', responseTime: '125ms', requests: '2.5M/day' },
    { name: 'Database Cluster', status: 'healthy', uptime: '99.99%', responseTime: '45ms', requests: '15M/day' },
    { name: 'Cache Layer (Redis)', status: 'healthy', uptime: '99.95%', responseTime: '5ms', requests: '50M/day' },
    { name: 'Message Queue', status: 'warning', uptime: '95%', responseTime: '200ms', requests: '5M/day' },
    { name: 'Storage Service', status: 'healthy', uptime: '99.97%', responseTime: '350ms', requests: '1M/day' },
    { name: 'Search Engine (ES)', status: 'healthy', uptime: '99.96%', responseTime: '200ms', requests: '3M/day' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success'
      case 'warning':
        return 'bg-warning'
      case 'critical':
        return 'bg-destructive'
      default:
        return 'bg-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">System Status</h1>
        <p className="text-muted-foreground mt-2">Real-time infrastructure monitoring and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">CPU Usage</p>
              <p className="text-3xl font-bold text-card-foreground">70%</p>
              <p className="text-xs text-warning mt-2">High utilization</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Memory Usage</p>
              <p className="text-3xl font-bold text-card-foreground">76%</p>
              <p className="text-xs text-warning mt-2">86GB / 112GB</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Disk I/O</p>
              <p className="text-3xl font-bold text-card-foreground">2.4GB/s</p>
              <p className="text-xs text-success mt-2">Within limits</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Network className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">CPU Usage (Last Hour)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#00AA00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Memory Usage (Last Hour)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#2196F3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Service Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Service Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Uptime</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Response Time</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Requests/Day</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.name} className="border-b border-border-light hover:bg-muted transition-colors">
                  <td className="py-3 px-4 text-sm text-card-foreground font-medium">{service.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusIndicator(service.status)}`} />
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{service.uptime}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{service.responseTime}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{service.requests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

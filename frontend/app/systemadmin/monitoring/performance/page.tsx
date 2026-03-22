'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Zap, Clock, AlertCircle } from 'lucide-react'

export default function PerformanceMonitoringPage() {
  const responseTimeData = [
    { time: '12:00', api: 125, web: 245, mobile: 315 },
    { time: '12:15', api: 132, web: 251, mobile: 328 },
    { time: '12:30', api: 128, web: 248, mobile: 320 },
    { time: '12:45', api: 145, web: 268, mobile: 342 },
    { time: '13:00', api: 138, web: 260, mobile: 335 },
    { time: '13:15', api: 152, web: 275, mobile: 355 },
    { time: '13:30', api: 165, web: 290, mobile: 370 },
  ]

  const throughputData = [
    { time: '12:00', requests: 2500 },
    { time: '12:15', requests: 2650 },
    { time: '12:30', requests: 2480 },
    { time: '12:45', requests: 2890 },
    { time: '13:00', requests: 2720 },
    { time: '13:15', requests: 3050 },
    { time: '13:30', requests: 3200 },
  ]

  const errorRateData = [
    { time: '12:00', errors: 12 },
    { time: '12:15', errors: 15 },
    { time: '12:30', errors: 10 },
    { time: '12:45', errors: 22 },
    { time: '13:00', errors: 18 },
    { time: '13:15', errors: 25 },
    { time: '13:30', errors: 28 },
  ]

  const metrics = [
    {
      label: 'Avg Response Time',
      value: '165ms',
      change: '+12ms',
      icon: Clock,
      color: 'bg-blue-100',
      status: 'warning',
    },
    {
      label: 'Throughput',
      value: '3,200 req/s',
      change: '+15%',
      icon: Zap,
      color: 'bg-green-100',
      status: 'healthy',
    },
    {
      label: 'Error Rate',
      value: '0.87%',
      change: '+0.15%',
      icon: AlertCircle,
      color: 'bg-red-100',
      status: 'warning',
    },
    {
      label: 'Uptime',
      value: '99.96%',
      change: '+0.02%',
      icon: Activity,
      color: 'bg-green-100',
      status: 'healthy',
    },
  ]

  const endpoints = [
    { path: '/api/users', avgTime: '125ms', p95: '245ms', p99: '520ms', errors: '0.2%' },
    { path: '/api/tenants', avgTime: '98ms', p95: '180ms', p99: '380ms', errors: '0.1%' },
    { path: '/api/billing', avgTime: '245ms', p95: '420ms', p99: '980ms', errors: '0.5%' },
    { path: '/api/analytics', avgTime: '420ms', p95: '780ms', p99: '1500ms', errors: '1.2%' },
    { path: '/api/auth', avgTime: '156ms', p95: '280ms', p99: '640ms', errors: '0.3%' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Performance Monitoring</h1>
        <p className="text-muted-foreground mt-2">Track API performance, throughput, and error rates</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{metric.value}</p>
                  <p className={`text-xs mt-2 ${metric.status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                    {metric.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="w-6 h-6 text-card-foreground" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Response Time Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Response Time by Endpoint</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="time" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="api" stroke="#00AA00" strokeWidth={2} name="API" />
            <Line type="monotone" dataKey="web" stroke="#FFD700" strokeWidth={2} name="Web" />
            <Line type="monotone" dataKey="mobile" stroke="#2196F3" strokeWidth={2} name="Mobile" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Request Throughput</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="requests" fill="#00AA0030" stroke="#00AA00" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Error Rate */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Error Rate Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={errorRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="errors" fill="#FF6B6B" name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Endpoint Performance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">API Endpoint Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Endpoint</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Avg Response Time</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">P95</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">P99</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint, idx) => {
                const errorRate = parseFloat(endpoint.errors)
                const errorColor = errorRate > 0.5 ? 'text-destructive' : errorRate > 0.2 ? 'text-warning' : 'text-success'
                return (
                  <tr key={idx} className="border-b border-border-light hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-card-foreground font-mono">{endpoint.path}</td>
                    <td className="py-3 px-4 text-sm text-card-foreground">{endpoint.avgTime}</td>
                    <td className="py-3 px-4 text-sm text-card-foreground">{endpoint.p95}</td>
                    <td className="py-3 px-4 text-sm text-card-foreground">{endpoint.p99}</td>
                    <td className={`py-3 px-4 text-sm font-semibold ${errorColor}`}>{endpoint.errors}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-6 border-l-4 border-l-warning bg-warning/5">
        <h2 className="text-lg font-semibold text-card-foreground mb-3">Active Performance Alerts</h2>
        <div className="space-y-2">
          {[
            'API response time increased by 32% in the last 30 minutes',
            'Error rate for /api/billing endpoint is 1.2% (threshold: 0.5%)',
            'Memory usage on database server reached 86% capacity',
          ].map((alert, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2">
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-card-foreground">{alert}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

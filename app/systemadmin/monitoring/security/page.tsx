'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Shield, Lock, Eye, Trash2, Check } from 'lucide-react'

export default function SecurityMonitoringPage() {
  const suspiciousActivities = [
    {
      id: 1,
      type: 'Unusual Login',
      severity: 'high',
      user: 'john@acme.com',
      location: 'New York, USA',
      ipAddress: '203.0.113.42',
      time: '5 minutes ago',
      action: 'Pending Review',
    },
    {
      id: 2,
      type: 'Multiple Failed Logins',
      severity: 'medium',
      user: 'Unknown',
      location: 'Unknown',
      ipAddress: '198.51.100.89',
      time: '15 minutes ago',
      action: 'Blocked',
    },
    {
      id: 3,
      type: 'API Rate Limit Exceeded',
      severity: 'medium',
      user: 'api-bot@globalsol.com',
      location: 'Chicago, USA',
      ipAddress: '192.0.2.50',
      time: '1 hour ago',
      action: 'Throttled',
    },
    {
      id: 4,
      type: 'Privilege Escalation Attempt',
      severity: 'high',
      user: 'Unknown',
      location: 'Unknown',
      ipAddress: '198.51.100.15',
      time: '2 hours ago',
      action: 'Blocked',
    },
    {
      id: 5,
      type: 'Data Export Detected',
      severity: 'low',
      user: 'admin@legacy.com',
      location: 'Los Angeles, USA',
      ipAddress: '203.0.113.88',
      time: '3 hours ago',
      action: 'Approved',
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Pending Review':
        return 'text-warning'
      case 'Blocked':
        return 'text-destructive'
      case 'Throttled':
        return 'text-warning'
      case 'Approved':
        return 'text-success'
      default:
        return 'text-card-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Security Monitoring</h1>
        <p className="text-muted-foreground mt-2">Monitor threats and manage access control</p>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Threats', value: '3', icon: AlertCircle, color: 'bg-red-100' },
          { label: 'Blocked IPs', value: '12', icon: Shield, color: 'bg-yellow-100' },
          { label: 'Secure Logins', value: '2FA: 78%', icon: Lock, color: 'bg-green-100' },
          { label: 'Last Scan', value: '2 mins ago', icon: Eye, color: 'bg-blue-100' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                </div>
                <div className={`p-2 rounded ${stat.color}`}>
                  <Icon className="w-5 h-5 text-card-foreground" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Suspicious Activities */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Suspicious Activities</h2>
        <div className="space-y-3">
          {suspiciousActivities.map((activity) => (
            <div key={activity.id} className={`border rounded-lg p-4 ${getSeverityColor(activity.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{activity.type}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs opacity-90">
                    <div>User: {activity.user}</div>
                    <div>Location: {activity.location}</div>
                    <div>IP: {activity.ipAddress}</div>
                    <div>Time: {activity.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {activity.action === 'Pending Review' && (
                  <>
                    <Button className="text-xs h-7 bg-green-600 hover:bg-green-700 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button className="text-xs h-7 bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Block
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* IP Whitelist/Blacklist */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">IP Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Whitelisted IPs</h3>
            <div className="space-y-2">
              {['203.0.113.1', '203.0.113.2', '203.0.113.3'].map((ip) => (
                <div key={ip} className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                  <span className="text-sm font-medium text-card-foreground">{ip}</span>
                  <Button className="text-xs h-6 text-destructive bg-white hover:bg-red-50">Remove</Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Blacklisted IPs</h3>
            <div className="space-y-2">
              {['198.51.100.89', '198.51.100.15', '192.0.2.201'].map((ip) => (
                <div key={ip} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <span className="text-sm font-medium text-card-foreground">{ip}</span>
                  <Button className="text-xs h-6 text-destructive bg-white hover:bg-red-50">Remove</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Security Settings</h2>
        <div className="space-y-4">
          {[
            { label: 'Enforce Two-Factor Authentication', enabled: true },
            { label: 'Require HTTPS only', enabled: true },
            { label: 'Enable CORS restrictions', enabled: false },
            { label: 'Enable IP whitelisting', enabled: false },
            { label: 'Require password change every 90 days', enabled: true },
            { label: 'Log all API calls', enabled: true },
          ].map((setting, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm text-card-foreground font-medium">{setting.label}</span>
              <input
                type="checkbox"
                checked={setting.enabled}
                className="w-5 h-5 rounded"
                readOnly
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

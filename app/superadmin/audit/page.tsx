'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ActivityTimeline from '@/components/superadmin/audit/activity-timeline'
import LoginActivity from '@/components/superadmin/audit/login-activity'
import SecurityAlerts from '@/components/superadmin/audit/security-alerts'

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit & Monitoring</h1>
        <p className="text-gray-600 text-sm mt-1">Track system activity, logins, and security events</p>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="logins">Logins</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <ActivityTimeline />
        </TabsContent>

        <TabsContent value="logins" className="space-y-4">
          <LoginActivity />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityAlerts />
        </TabsContent>
      </Tabs>
    </div>
  )
}

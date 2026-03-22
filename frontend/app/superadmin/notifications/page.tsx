'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotificationStats from '@/components/superadmin/notifications/notification-stats'
import AnnouncementsList from '@/components/superadmin/notifications/announcements-list'
import AlertsList from '@/components/superadmin/notifications/alerts-list'
import ChannelConfig from '@/components/superadmin/notifications/channel-config'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 text-sm mt-1">Manage system-wide announcements, alerts, and notification channels</p>
      </div>

      <NotificationStats />

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <AnnouncementsList />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertsList />
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <ChannelConfig />
        </TabsContent>
      </Tabs>
    </div>
  )
}

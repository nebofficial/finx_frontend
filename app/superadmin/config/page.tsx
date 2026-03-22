'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EmailSettings from '@/components/superadmin/config/email-settings'
import SmsSettings from '@/components/superadmin/config/sms-settings'
import GlobalConfigForm from '@/components/superadmin/config/global-config-form'
import SystemHealthStatus from '@/components/superadmin/config/system-health-status'
import { Mail, MessageSquare, Settings, Activity } from 'lucide-react'

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-600 text-sm mt-1">Configure system-wide settings and integrations</p>
      </div>

      <SystemHealthStatus />

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail size={16} />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare size={16} />
            SMS
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Settings size={16} />
            Global
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity size={16} />
            Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <SmsSettings />
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <GlobalConfigForm />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <SystemHealthStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}

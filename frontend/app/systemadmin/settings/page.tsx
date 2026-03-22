import SystemSettings from '@/components/systemadmin/settings/system-settings'
import ApiKeys from '@/components/systemadmin/settings/api-keys'
import Webhooks from '@/components/systemadmin/settings/webhooks'
import AuditLogs from '@/components/systemadmin/settings/audit-logs'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and integrations</p>
      </div>

      <div className="space-y-6">
        <SystemSettings />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApiKeys />
          <Webhooks />
        </div>
        <AuditLogs />
      </div>
    </div>
  )
}

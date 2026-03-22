'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { fetchDashboard, createRole, updateRole, deleteRole, cloneRole, assignRole, bulkAssignRole, updatePermissions } from '@/services/api/rolePermissionApi'
import { RoleItem, PermissionItem, UserItem, AuditLogItem, ScopeType } from './types'
import { RPTopbar } from './layout/RPTopbar'
import { RoleTable } from './roles/RoleTable'
import { PermissionMatrix } from './permissions/PermissionMatrix'
import { AssignRolePanel } from './assignments/AssignRolePanel'
import { RoleForm } from './roles/RoleForm'
import { AuditLogTable } from './audit/AuditLogTable'
import { RoleTypeFilter } from './filters/RoleTypeFilter'
import { StatusFilter } from './filters/StatusFilter'
import { THEME } from '@/lib/systemadmin-theme'

export function RolePermissionDashboard() {
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [scope, setScope] = useState<ScopeType | 'all'>('all')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId]
  )

  const reload = async () => {
    setLoading(true)
    try {
      const data = await fetchDashboard({
        scope: scope === 'all' ? undefined : scope,
        status: status === 'all' ? undefined : status,
        search: search || undefined,
      })
      setRoles(data.roles)
      setPermissions(data.permissions)
      setUsers(data.users)
      setLogs(data.logs)
      if (!selectedRoleId && data.roles.length > 0) setSelectedRoleId(data.roles[0].id)
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void reload()
  }, [scope, status])

  const runAction = async (handler: () => Promise<void>, okMessage: string) => {
    try {
      setLoading(true)
      await handler()
      setMessage(okMessage)
      await reload()
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = { backgroundColor: THEME.cardBg, borderColor: THEME.border }
  const headerStyle = { backgroundColor: THEME.headerBg, borderBottom: `1px solid ${THEME.border}` }

  return (
    <div className="space-y-6">
      <RPTopbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={reload}
        onRefresh={reload}
        loading={loading}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card style={cardStyle} className="xl:col-span-2 shadow-sm">
          <CardHeader style={headerStyle} className="rounded-t-xl px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle style={{ color: THEME.titleColor }} className="text-base font-semibold">Role Management</CardTitle>
              <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
                View, edit, and manage all system roles.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <RoleTypeFilter value={scope} onChange={setScope} />
              <StatusFilter value={status} onChange={setStatus} />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <RoleTable
              roles={roles}
              selectedRoleId={selectedRole?.id}
              onSelect={setSelectedRoleId}
              onDelete={(id) => runAction(() => deleteRole(id), 'Role deleted')}
              onToggle={(id, isActive) => runAction(() => updateRole(id, { is_active: isActive }), 'Role status updated')}
              onClone={(sourceRoleId, name, description) => runAction(() => cloneRole({ sourceRoleId, name, description }), 'Role cloned')}
              onEdit={(id, payload) => runAction(() => updateRole(id, payload), 'Role updated')}
            />
          </CardContent>
        </Card>

        <Card style={cardStyle} className="shadow-sm">
          <CardHeader style={headerStyle} className="rounded-t-xl px-6 py-4">
            <CardTitle style={{ color: THEME.titleColor }} className="text-base font-semibold">Role Actions</CardTitle>
            <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
              Create a new role with permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <RoleForm
              permissions={permissions}
              onSubmit={(payload) => runAction(() => createRole(payload), 'Role created')}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card style={cardStyle} className="shadow-sm">
          <CardHeader style={headerStyle} className="rounded-t-xl px-6 py-4">
            <CardTitle style={{ color: THEME.titleColor }} className="text-base font-semibold">Permission Matrix</CardTitle>
            <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
              Adjust permissions for the selected role.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <PermissionMatrix
              role={selectedRole}
              permissions={permissions}
              onSave={(permissionIds) => {
                if (!selectedRole) return Promise.resolve()
                return runAction(() => updatePermissions({ roleId: selectedRole.id, permissionIds }), 'Permissions updated')
              }}
            />
          </CardContent>
        </Card>

        <Card style={cardStyle} className="shadow-sm">
          <CardHeader style={headerStyle} className="rounded-t-xl px-6 py-4">
            <CardTitle style={{ color: THEME.titleColor }} className="text-base font-semibold">Assign Roles</CardTitle>
            <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
              Assign or bulk-assign roles to users.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <AssignRolePanel
              roles={roles}
              users={users}
              onAssign={(userId, roleId) => runAction(() => assignRole({ userId, roleId }), 'Role assigned')}
              onBulkAssign={(userIds, roleId) => runAction(() => bulkAssignRole({ userIds, roleId }), 'Bulk assignment complete')}
            />
          </CardContent>
        </Card>
      </div>

      <Card style={cardStyle} className="shadow-sm">
        <CardHeader style={headerStyle} className="rounded-t-xl px-6 py-4">
          <CardTitle style={{ color: THEME.titleColor }} className="text-base font-semibold">Scope Control</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-wrap gap-2">
          <RoleTypeFilter value={scope} onChange={setScope} />
        </CardContent>
      </Card>

      <Card style={cardStyle} className="shadow-sm">
        <CardHeader style={headerStyle} className="rounded-t-xl px-6 py-4">
          <CardTitle style={{ color: THEME.titleColor }} className="text-base font-semibold">Audit Logs</CardTitle>
          <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
            Recent permission and role changes across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <AuditLogTable logs={logs} />
        </CardContent>
      </Card>

      {message && (
        <p style={{ color: THEME.subtitleColor }} className="text-sm text-center py-2">{message}</p>
      )}
    </div>
  )
}

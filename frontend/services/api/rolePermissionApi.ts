import api from '@/lib/axios'

export type ScopeType = 'system' | 'tenant' | 'branch'

export interface PermissionItem {
  id: string
  key: string
  module: string
  action: string
  label: string
}

export interface UserItem {
  id: string
  name: string
  email: string
  role: string
}

export interface RoleItem {
  id: string
  name: string
  description: string | null
  scope: ScopeType
  is_active: boolean
  permissions: PermissionItem[]
  assigned_users: UserItem[]
}

export interface AuditLogItem {
  id: string
  actor_email: string | null
  actor_role: string | null
  action: string
  resource: string | null
  resource_id: string | null
  createdAt: string
}

export interface DashboardPayload {
  roles: RoleItem[]
  permissions: PermissionItem[]
  users: UserItem[]
  logs: AuditLogItem[]
}

export const fetchDashboard = async (params?: { scope?: string; status?: string; search?: string }) => {
  const res = await api.get('/system/rbac/dashboard', { params })
  return res.data.data as DashboardPayload
}

export const createRole = async (payload: { name: string; description?: string; scope: ScopeType; permissionIds?: string[] }) => {
  await api.post('/system/rbac/roles', payload)
}

export const updateRole = async (id: string, payload: { name?: string; description?: string; scope?: ScopeType; is_active?: boolean }) => {
  await api.put(`/system/rbac/roles/${id}`, payload)
}

export const deleteRole = async (id: string) => {
  await api.delete(`/system/rbac/roles/${id}`)
}

export const cloneRole = async (payload: { sourceRoleId: string; name: string; description?: string }) => {
  await api.post('/system/rbac/roles/clone', payload)
}

export const assignRole = async (payload: { userId: string; roleId: string }) => {
  await api.post('/system/rbac/assign', payload)
}

export const bulkAssignRole = async (payload: { userIds: string[]; roleId: string }) => {
  await api.post('/system/rbac/assign/bulk', payload)
}

export const updatePermissions = async (payload: { roleId: string; permissionIds: string[] }) => {
  await api.put('/system/rbac/permissions', payload)
}

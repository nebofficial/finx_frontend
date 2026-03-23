'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Users, Lock, Loader2 } from 'lucide-react'
import { THEME } from '@/lib/systemadmin-theme'
import { fetchDashboard, deleteRole, type RoleItem } from '@/services/api/rolePermissionApi'
import { toast } from 'sonner'

export default function RolesList() {
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchDashboard({})
      setRoles(data.roles)
    } catch {
      toast.error('Failed to load roles.')
      setRoles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleDelete = async (role: RoleItem) => {
    if (!window.confirm(`Delete role "${role.name}"? This cannot be undone if no users are assigned.`)) return
    try {
      await deleteRole(role.id)
      toast.success('Role deleted.')
      void load()
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? String((e as { response?: { data?: { message?: string } } }).response?.data?.message)
        : 'Failed to delete role.'
      toast.error(msg || 'Failed to delete role.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading roles…
      </div>
    )
  }

  if (roles.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">No roles found.</p>
  }

  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <div
          key={role.id}
          style={{ borderColor: THEME.border, backgroundColor: THEME.mainBg }}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 sm:py-4 rounded-2xl border shadow-sm transition-all group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: THEME.titleColor }} />

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span style={{ color: THEME.titleColor }} className="font-bold text-[15px]">
                {role.name}
              </span>
              <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded-md border" style={{ borderColor: THEME.border, color: THEME.subtitleColor }}>
                {role.scope}
              </span>
              {!role.is_active && (
                <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">Inactive</span>
              )}
            </div>
            <p style={{ color: THEME.subtitleColor }} className="text-sm truncate mb-2.5">
              {role.description || '—'}
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" style={{ color: THEME.monoText }}>
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{role.assigned_users?.length ?? 0} assigned users</span>
              </span>
              <span className="flex items-center gap-1.5" style={{ color: THEME.monoText }}>
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{role.permissions?.length ?? 0} permissions</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Link href={`/systemadmin/roles/${role.id}/edit`}>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shadow-sm"
                style={{ backgroundColor: THEME.hover, color: THEME.titleColor, borderColor: THEME.border }}
                title="Edit Role"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shadow-sm"
              style={{ backgroundColor: THEME.hover, color: 'red', borderColor: THEME.border }}
              title="Delete Role"
              type="button"
              onClick={() => void handleDelete(role)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PermissionItem, RoleItem } from '../types'
import { ModuleRow } from './ModuleRow'
import { PermissionLegend } from './PermissionLegend'

interface Props {
  role?: RoleItem
  permissions: PermissionItem[]
  onSave: (permissionIds: string[]) => Promise<void>
}

const actionColumns = ['view', 'create', 'update', 'delete', 'approve']

export function PermissionMatrix({ role, permissions, onSave }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds(role?.permissions.map((permission) => permission.id) || [])
  }, [role?.id])

  const groupedByModule = useMemo(() => {
    return permissions.reduce<Record<string, PermissionItem[]>>((acc, permission) => {
      const moduleName = permission.module.toLowerCase()
      if (!acc[moduleName]) acc[moduleName] = []
      acc[moduleName].push(permission)
      return acc
    }, {})
  }, [permissions])

  const togglePermission = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  if (!role) return <p className="text-sm text-slate-300">Select a role to manage permissions.</p>

  return (
    <div>
      <p className="text-sm text-slate-300 mb-2">Editing permissions for <span className="font-semibold">{role.name}</span></p>
      <PermissionLegend />
      <div className="grid grid-cols-7 gap-2 text-xs text-slate-400 uppercase py-2 border-b border-slate-700">
        <p className="col-span-2">Module</p>
        {actionColumns.map((action) => <p key={action} className="text-center">{action}</p>)}
      </div>
      {Object.entries(groupedByModule).map(([moduleName, items]) => (
        <ModuleRow
          key={moduleName}
          moduleName={moduleName}
          items={items}
          selectedIds={selectedIds}
          onToggle={togglePermission}
          actionColumns={actionColumns}
        />
      ))}
      <Button className="mt-4" onClick={() => void onSave(selectedIds)}>Save Permission Matrix</Button>
    </div>
  )
}

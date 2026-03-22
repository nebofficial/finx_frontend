'use client'

import { RoleItem, ScopeType } from '../types'
import { RoleRow } from './RoleRow'

interface Props {
  roles: RoleItem[]
  selectedRoleId?: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
  onClone: (sourceRoleId: string, name: string, description?: string) => void
  onEdit: (id: string, payload: { name?: string; description?: string; scope?: ScopeType }) => void
}

export function RoleTable({ roles, selectedRoleId, onSelect, onDelete, onToggle, onClone }: Props) {
  return (
    <div className="space-y-2">
      {roles.map((role) => (
        <RoleRow
          key={role.id}
          role={role}
          selected={role.id === selectedRoleId}
          onSelect={() => onSelect(role.id)}
          onDelete={() => onDelete(role.id)}
          onToggle={(active) => onToggle(role.id, active)}
          onClone={(name, description) => onClone(role.id, name, description)}
        />
      ))}
      {roles.length === 0 ? <p className="text-sm text-slate-300">No roles found.</p> : null}
    </div>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RoleItem, ScopeType } from '../types'
import { RoleStatusToggle } from './RoleStatusToggle'
import { CloneRoleModal } from './CloneRoleModal'

const scopeStyle: Record<ScopeType, string> = {
  system: 'bg-cyan-500/20 text-cyan-200',
  tenant: 'bg-violet-500/20 text-violet-200',
  branch: 'bg-orange-500/20 text-orange-200',
}

interface Props {
  role: RoleItem
  selected?: boolean
  onSelect: () => void
  onDelete: () => void
  onToggle: (active: boolean) => void
  onClone: (name: string, description?: string) => void
}

export function RoleRow({ role, selected, onSelect, onDelete, onToggle, onClone }: Props) {
  return (
    <div className={`grid grid-cols-12 gap-3 p-3 rounded-lg border ${selected ? 'border-indigo-400 bg-slate-900/70' : 'border-slate-700 bg-slate-900/40'}`}>
      <button onClick={onSelect} className="col-span-4 text-left">
        <p className="font-semibold">{role.name}</p>
        <p className="text-xs text-slate-400">{role.description || 'No description'}</p>
      </button>
      <div className="col-span-2 flex items-center">
        <Badge className={scopeStyle[role.scope]}>{role.scope}</Badge>
      </div>
      <div className="col-span-2 flex items-center text-sm">{role.permissions.length} perms</div>
      <div className="col-span-2 flex items-center text-sm">{role.assigned_users.length} users</div>
      <div className="col-span-2 flex items-center justify-end gap-2">
        <RoleStatusToggle checked={role.is_active} onChange={onToggle} />
        <CloneRoleModal onClone={onClone} />
        <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}

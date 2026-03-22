'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { UserItem } from '../types'

interface Props {
  users: UserItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function UserSelector({ users, selectedIds, onToggle }: Props) {
  return (
    <div className="space-y-1 max-h-40 overflow-auto rounded-md border border-emerald-500/30 p-2">
      {users.map((user) => (
        <label key={user.id} className="flex items-center gap-2 text-sm">
          <Checkbox checked={selectedIds.includes(user.id)} onCheckedChange={() => onToggle(user.id)} />
          <span>{user.name} ({user.email})</span>
        </label>
      ))}
    </div>
  )
}

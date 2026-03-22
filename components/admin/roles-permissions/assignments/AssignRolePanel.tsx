'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleItem, UserItem } from '../types'
import { BulkAssignModal } from './BulkAssignModal'

interface Props {
  roles: RoleItem[]
  users: UserItem[]
  onAssign: (userId: string, roleId: string) => void
  onBulkAssign: (userIds: string[], roleId: string) => void
}

export function AssignRolePanel({ roles, users, onAssign, onBulkAssign }: Props) {
  const [roleId, setRoleId] = useState('')
  const [userId, setUserId] = useState('')

  return (
    <div className="space-y-3">
      <Select value={roleId} onValueChange={setRoleId}>
        <SelectTrigger className="bg-emerald-950/20 border-emerald-300/30"><SelectValue placeholder="Select role" /></SelectTrigger>
        <SelectContent>
          {roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={userId} onValueChange={setUserId}>
        <SelectTrigger className="bg-emerald-950/20 border-emerald-300/30"><SelectValue placeholder="Select user" /></SelectTrigger>
        <SelectContent>
          {users.map((user) => <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button onClick={() => roleId && userId && onAssign(userId, roleId)}>Assign Role</Button>
        <BulkAssignModal users={users} roleId={roleId} onBulkAssign={onBulkAssign} />
      </div>
    </div>
  )
}

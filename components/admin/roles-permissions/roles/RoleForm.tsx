'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PermissionItem, ScopeType } from '../types'

interface Props {
  permissions: PermissionItem[]
  onSubmit: (payload: { name: string; description?: string; scope: ScopeType; permissionIds: string[] }) => void
}

export function RoleForm({ permissions, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [scope, setScope] = useState<ScopeType>('system')
  const [permissionIds, setPermissionIds] = useState<string[]>([])

  const togglePermission = (id: string) => {
    setPermissionIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-3">
      <Input placeholder="Role name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/80" />
      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/80" />
      <Select value={scope} onValueChange={(v) => setScope(v as ScopeType)}>
        <SelectTrigger className="bg-white/80"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="tenant">Tenant</SelectItem>
          <SelectItem value="branch">Branch</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 gap-1 max-h-40 overflow-auto rounded-md border border-amber-700/40 p-2">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center gap-2">
            <Checkbox
              checked={permissionIds.includes(permission.id)}
              onCheckedChange={() => togglePermission(permission.id)}
              id={`create-${permission.id}`}
            />
            <Label htmlFor={`create-${permission.id}`} className="text-xs">{permission.key}</Label>
          </div>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={() => {
          if (!name.trim()) return
          onSubmit({ name: name.trim(), description: description.trim() || undefined, scope, permissionIds })
          setName('')
          setDescription('')
          setPermissionIds([])
        }}
      >
        Create Role
      </Button>
    </div>
  )
}

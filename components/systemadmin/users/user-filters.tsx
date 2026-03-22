'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter } from 'lucide-react'

export default function UserFilters() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')

  return (
    <div className="flex gap-4 items-center flex-wrap">
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filters:</span>
      </div>

      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-40 bg-card text-foreground placeholder-muted-foreground border-input"
      />

      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-40 bg-card text-foreground border-input">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40 bg-card text-foreground border-input">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

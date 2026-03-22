'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScopeType } from '../types'

interface Props {
  value: ScopeType | 'all'
  onChange: (value: ScopeType | 'all') => void
}

export function RoleTypeFilter({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ScopeType | 'all')}>
      <SelectTrigger className="w-36 bg-slate-950/40 border-slate-700 text-slate-100">
        <SelectValue placeholder="Scope" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Scopes</SelectItem>
        <SelectItem value="system">System</SelectItem>
        <SelectItem value="tenant">Tenant</SelectItem>
        <SelectItem value="branch">Branch</SelectItem>
      </SelectContent>
    </Select>
  )
}

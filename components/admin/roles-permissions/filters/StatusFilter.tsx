'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  value: 'all' | 'active' | 'inactive'
  onChange: (value: 'all' | 'active' | 'inactive') => void
}

export function StatusFilter({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as 'all' | 'active' | 'inactive')}>
      <SelectTrigger className="w-36 bg-slate-950/40 border-slate-700 text-slate-100">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  )
}

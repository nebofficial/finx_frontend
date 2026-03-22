'use client'

import { Input } from '@/components/ui/input'

export function SearchRoles({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search roles..." />
}

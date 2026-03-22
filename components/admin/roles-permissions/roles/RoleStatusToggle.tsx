'use client'

import { Switch } from '@/components/ui/switch'

export function RoleStatusToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <Switch checked={checked} onCheckedChange={onChange} />
}

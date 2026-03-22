'use client'

import { Checkbox } from '@/components/ui/checkbox'

export function ActionCheckbox({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
  return <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
}

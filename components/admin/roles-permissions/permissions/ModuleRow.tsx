'use client'

import { PermissionItem } from '../types'
import { ActionCheckbox } from './ActionCheckbox'

interface Props {
  moduleName: string
  items: PermissionItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
  actionColumns: string[]
}

export function ModuleRow({ moduleName, items, selectedIds, onToggle, actionColumns }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2 items-center border-b border-slate-700 py-2">
      <p className="col-span-2 font-medium capitalize">{moduleName}</p>
      {actionColumns.map((action) => {
        const perm = items.find((it) => it.action.toLowerCase() === action)
        if (!perm) return <div key={`${moduleName}-${action}`} className="text-center text-slate-500">-</div>
        return (
          <div key={perm.id} className="flex justify-center">
            <ActionCheckbox
              id={`perm-${perm.id}`}
              checked={selectedIds.includes(perm.id)}
              onChange={() => onToggle(perm.id)}
            />
          </div>
        )
      })}
    </div>
  )
}

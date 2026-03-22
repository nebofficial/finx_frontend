'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { THEME } from '@/lib/systemadmin-theme'
import { FolderGit2 } from 'lucide-react'

interface Permission {
  id: string
  name: string
  category: string
}

const permissions: Permission[] = [
  { id: '1', name: 'Create Users',     category: 'User Management' },
  { id: '2', name: 'Edit Users',       category: 'User Management' },
  { id: '3', name: 'Delete Users',     category: 'User Management' },
  { id: '4', name: 'View Users',       category: 'User Management' },

  { id: '5', name: 'Create Tenants',   category: 'Tenant Management' },
  { id: '6', name: 'Edit Tenants',     category: 'Tenant Management' },
  { id: '7', name: 'Delete Tenants',   category: 'Tenant Management' },
  { id: '8', name: 'View Tenants',     category: 'Tenant Management' },

  { id: '9',  name: 'View Billing',    category: 'Billing' },
  { id: '10', name: 'Manage Plans',    category: 'Billing' },
  
  { id: '11', name: 'Manage Settings', category: 'System' },
  { id: '12', name: 'View Audit Logs', category: 'System' },
]

const groupedPermissions = permissions.reduce((acc, perm) => {
  if (!acc[perm.category]) acc[perm.category] = []
  acc[perm.category].push(perm)
  return acc
}, {} as Record<string, Permission[]>)

export default function PermissionsList() {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])

  return (
    <div className="space-y-4">
      {Object.entries(groupedPermissions).map(([category, perms]) => (
        <div key={category}
          style={{ backgroundColor: THEME.mainBg, borderColor: THEME.border }}
          className="rounded-2xl border shadow-sm overflow-hidden">
          
          <div style={{ borderBottom: `1px solid ${THEME.border}` }}
            className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FolderGit2 className="w-4 h-4 opacity-70" style={{ color: THEME.titleColor }} />
              <p style={{ color: THEME.titleColor }}
                className="text-xs font-bold uppercase tracking-wider">
                {category}
              </p>
            </div>
            <span style={{ backgroundColor: THEME.hover, color: THEME.titleColor }} className="text-[10px] font-bold px-2 py-0.5 rounded-full">
              {perms.filter((p) => selected.includes(p.id)).length} / {perms.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {perms.map((perm) => (
              <label key={perm.id} htmlFor={`perm-${perm.id}`}
                style={{ backgroundColor: selected.includes(perm.id) ? THEME.hover : 'transparent' }}
                className="flex items-start gap-3 cursor-pointer group p-2 -m-2 rounded-lg transition-colors">
                <Checkbox
                  id={`perm-${perm.id}`}
                  checked={selected.includes(perm.id)}
                  onCheckedChange={() => toggle(perm.id)}
                  className="mt-0.5"
                />
                <span style={{ color: THEME.subtitleColor }}
                  className="text-sm font-medium leading-none transition-colors">
                  {perm.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

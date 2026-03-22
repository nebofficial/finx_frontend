'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Users, Lock } from 'lucide-react'
import { THEME } from '@/lib/systemadmin-theme'

interface Role {
  id: string
  name: string
  description: string
  users: number
  permissions: number
}

const roles: Role[] = [
  { id: '1', name: 'SuperAdmin',  description: 'Full system access and platform control',      users: 2,  permissions: 42 },
  { id: '2', name: 'TenantAdmin', description: 'Manage cooperatives and view analytics',    users: 15, permissions: 28 },
  { id: '3', name: 'Staff User',  description: 'Limited operational day-to-day access',          users: 89, permissions: 12 },
  { id: '4', name: 'Auditor',     description: 'Read-only access to all tracking resources',   users: 45, permissions: 5  },
]

export default function RolesList() {
  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <div
          key={role.id}
          style={{ borderColor: THEME.border, backgroundColor: THEME.mainBg }}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 sm:py-4 rounded-2xl border shadow-sm transition-all group cursor-pointer relative overflow-hidden"
        >
          {/* Subtle decoration bar on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: THEME.titleColor }} />

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: THEME.titleColor }} className="font-bold text-[15px]">{role.name}</span>
            </div>
            <p style={{ color: THEME.subtitleColor }} className="text-sm truncate mb-2.5">{role.description}</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" style={{ color: THEME.monoText }}>
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{role.users} active users</span>
              </span>
              <span className="flex items-center gap-1.5" style={{ color: THEME.monoText }}>
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{role.permissions} permissions</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Link href={`/systemadmin/roles/${role.id}/edit`}>
              <Button variant="outline" size="icon" className="h-9 w-9 shadow-sm"
                style={{ backgroundColor: THEME.hover, color: THEME.titleColor, borderColor: THEME.border }}
                title="Edit Role">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="h-9 w-9 shadow-sm" 
              style={{ backgroundColor: THEME.hover, color: 'red', borderColor: THEME.border }}
              title="Delete Role">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

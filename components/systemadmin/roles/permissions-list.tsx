'use client'

import { useCallback, useEffect, useState } from 'react'
import { THEME } from '@/lib/systemadmin-theme'
import { FolderGit2, Loader2 } from 'lucide-react'
import { fetchDashboard, type PermissionItem } from '@/services/api/rolePermissionApi'
import { toast } from 'sonner'

function groupByModule(perms: PermissionItem[]) {
  return perms.reduce(
    (acc, p) => {
      const m = p.module || 'general'
      if (!acc[m]) acc[m] = []
      acc[m].push(p)
      return acc
    },
    {} as Record<string, PermissionItem[]>,
  )
}

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchDashboard({})
      setPermissions(data.permissions)
    } catch {
      toast.error('Failed to load permissions.')
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading…
      </div>
    )
  }

  const grouped = groupByModule(permissions)

  return (
    <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
      {Object.entries(grouped).map(([category, perms]) => (
        <div
          key={category}
          style={{ backgroundColor: THEME.mainBg, borderColor: THEME.border }}
          className="rounded-2xl border shadow-sm overflow-hidden"
        >
          <div
            style={{ borderBottom: `1px solid ${THEME.border}` }}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2.5">
              <FolderGit2 className="w-4 h-4 opacity-70" style={{ color: THEME.titleColor }} />
              <p style={{ color: THEME.titleColor }} className="text-xs font-bold uppercase tracking-wider">
                {category}
              </p>
            </div>
            <span
              style={{ backgroundColor: THEME.hover, color: THEME.titleColor }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {perms.length}
            </span>
          </div>

          <ul className="p-4 space-y-2">
            {perms.map((perm) => (
              <li
                key={perm.id}
                className="text-sm border-b last:border-0 pb-2 last:pb-0"
                style={{ borderColor: THEME.border, color: THEME.subtitleColor }}
              >
                <span className="font-medium" style={{ color: THEME.titleColor }}>
                  {perm.label}
                </span>
                <span className="text-xs opacity-70 ml-2 font-mono">{perm.key}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

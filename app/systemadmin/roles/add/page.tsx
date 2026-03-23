'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, CheckCircle2, ShieldPlus } from 'lucide-react'
import { toast } from 'sonner'
import { THEME } from '@/lib/systemadmin-theme'
import { createRole, fetchDashboard, type PermissionItem, type ScopeType } from '@/services/api/rolePermissionApi'

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

const inputStyle = {
  backgroundColor: THEME.inputBg,
  borderColor: THEME.inputBorder,
  color: THEME.inputText,
}

export default function AddRolePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadPerms, setLoadPerms] = useState(true)
  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [formData, setFormData] = useState({ name: '', description: '', scope: 'tenant' as ScopeType })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const byModule = useMemo(() => groupByModule(permissions), [permissions])

  const load = useCallback(async () => {
    setLoadPerms(true)
    try {
      const data = await fetchDashboard({})
      setPermissions(data.permissions)
    } catch {
      toast.error('Failed to load permissions.')
    } finally {
      setLoadPerms(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePerm = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleModule = (mod: string) => {
    const ids = (byModule[mod] || []).map((p) => p.id)
    setSelectedIds((prev) => {
      const allOn = ids.every((id) => prev.has(id))
      const next = new Set(prev)
      if (allOn) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === permissions.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(permissions.map((p) => p.id)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Role name is required')
      return
    }
    if (selectedIds.size === 0) {
      toast.error('Select at least one permission')
      return
    }
    setIsLoading(true)
    try {
      await createRole({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        scope: formData.scope,
        permissionIds: Array.from(selectedIds),
      })
      toast.success('Role created successfully')
      router.push('/systemadmin/roles')
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'response' in e
          ? String((e as { response?: { data?: { message?: string } } }).response?.data?.message)
          : 'Failed to create role'
      toast.error(msg || 'Failed to create role')
    } finally {
      setIsLoading(false)
    }
  }

  const allChecked = permissions.length > 0 && selectedIds.size === permissions.length

  return (
    <div className="space-y-6 min-h-screen p-6 rounded-xl" style={{ backgroundColor: THEME.mainBg }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: THEME.titleColor }} className="text-3xl font-bold tracking-tight">
            Create Role
          </h1>
          <p style={{ color: THEME.subtitleColor }} className="mt-1 text-sm">
            Map a role to real platform permissions (same model as Roles &amp; Permissions dashboard).
          </p>
        </div>
        <Link href="/systemadmin/roles">
          <Button
            variant="outline"
            style={{ borderColor: THEME.border, backgroundColor: THEME.hover, color: THEME.titleColor }}
            className="gap-2 shadow-sm h-10 px-4 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {loadPerms ? (
        <div className="flex items-center gap-2 text-muted-foreground py-12">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading permissions…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="xl:col-span-2 shadow-sm border">
            <CardHeader style={{ borderBottom: `1px solid ${THEME.border}` }} className="rounded-t-2xl px-6 py-5">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: THEME.hover }} className="p-2.5 rounded-xl border">
                  <ShieldPlus className="w-5 h-5" style={{ color: THEME.titleColor }} />
                </div>
                <div>
                  <CardTitle style={{ color: THEME.titleColor }} className="text-lg font-bold">
                    Role &amp; scope
                  </CardTitle>
                  <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
                    Name, description, and scope for this role definition.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: THEME.tableHeadText }} className="text-xs font-bold uppercase">
                    Role name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Billing reviewer"
                    style={inputStyle}
                    className="text-sm h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: THEME.tableHeadText }} className="text-xs font-bold uppercase">
                    Scope <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={formData.scope}
                    onValueChange={(v) => setFormData((p) => ({ ...p, scope: v as ScopeType }))}
                  >
                    <SelectTrigger style={inputStyle} className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="branch">Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label style={{ color: THEME.tableHeadText }} className="text-xs font-bold uppercase">
                  Description
                </Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional"
                  style={inputStyle}
                  className="text-sm h-11"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: THEME.border }}>
                  <Label style={{ color: THEME.titleColor }} className="text-base font-bold">
                    Permissions ({selectedIds.size}/{permissions.length})
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleAll}
                    style={{ color: THEME.titleColor, backgroundColor: THEME.hover, borderColor: THEME.border }}
                  >
                    {allChecked ? 'Clear all' : 'Select all'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(byModule).map(([mod, items]) => {
                    const ids = items.map((p) => p.id)
                    const allOn = ids.length > 0 && ids.every((id) => selectedIds.has(id))
                    return (
                      <div
                        key={mod}
                        style={{ backgroundColor: THEME.mainBg, borderColor: THEME.border }}
                        className="rounded-xl border shadow-sm overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3"
                          style={{ borderBottom: `1px solid ${THEME.border}` }}
                        >
                          <p style={{ color: THEME.titleColor }} className="text-xs font-bold uppercase">
                            {mod}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleModule(mod)}
                            className="text-[10px] font-bold uppercase px-2 py-1 rounded-md border"
                            style={{ backgroundColor: allOn ? THEME.hover : THEME.mainBg, borderColor: THEME.border, color: THEME.titleColor }}
                          >
                            {allOn ? 'None' : 'All'}
                          </button>
                        </div>
                        <div className="p-3 space-y-1 max-h-56 overflow-y-auto">
                          {items.map((perm) => (
                            <label
                              key={perm.id}
                              htmlFor={`add-${perm.id}`}
                              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg"
                              style={{
                                backgroundColor: selectedIds.has(perm.id) ? THEME.hover : 'transparent',
                              }}
                            >
                              <Checkbox
                                id={`add-${perm.id}`}
                                checked={selectedIds.has(perm.id)}
                                onCheckedChange={() => togglePerm(perm.id)}
                              />
                              <span style={{ color: THEME.subtitleColor }} className="text-sm">
                                {perm.label}{' '}
                                <span className="text-xs opacity-60">({perm.key})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-5 sticky top-6">
            <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="shadow-sm border">
              <CardHeader style={{ borderBottom: `1px solid ${THEME.border}` }} className="px-6 py-5">
                <CardTitle style={{ color: THEME.titleColor }} className="text-base font-bold">
                  Submit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: THEME.titleColor, color: THEME.mainBg }}
                  className="w-full font-semibold gap-2 h-11"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Create role
                    </>
                  )}
                </Button>
                <Link href="/systemadmin/roles" className="block">
                  <Button
                    variant="outline"
                    type="button"
                    style={{ borderColor: THEME.border, color: THEME.titleColor, backgroundColor: THEME.hover }}
                    className="w-full h-11"
                  >
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </form>
      )}
    </div>
  )
}

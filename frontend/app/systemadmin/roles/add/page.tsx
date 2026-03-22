'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Loader2, CheckCircle2, ShieldPlus } from 'lucide-react'
import { toast } from 'sonner'
import { THEME } from '@/lib/systemadmin-theme'

const permissionGroups = [
  { group: 'Users', items: [{ id: 'users:create', label: 'Create Users' }, { id: 'users:read', label: 'View Users' }, { id: 'users:update', label: 'Update Users' }, { id: 'users:delete', label: 'Delete Users' }] },
  { group: 'Tenants', items: [{ id: 'tenants:create', label: 'Create Tenants' }, { id: 'tenants:read', label: 'View Tenants' }, { id: 'tenants:update', label: 'Update Tenants' }, { id: 'tenants:delete', label: 'Delete Tenants' }] },
  { group: 'Roles', items: [{ id: 'roles:create', label: 'Create Roles' }, { id: 'roles:read', label: 'View Roles' }, { id: 'roles:update', label: 'Update Roles' }, { id: 'roles:delete', label: 'Delete Roles' }] },
  { group: 'Billing', items: [{ id: 'billing:read', label: 'View Billing' }, { id: 'billing:update', label: 'Update Billing' }, { id: 'billing:manage', label: 'Manage Plans' }] },
  { group: 'System', items: [{ id: 'analytics:read', label: 'View Analytics' }, { id: 'settings:manage', label: 'Manage Settings' }, { id: 'logs:read', label: 'View Audit Logs' }] },
  { group: 'Support', items: [{ id: 'support:read', label: 'View Support' }, { id: 'support:update', label: 'Update Support' }] },
]

const allPermissions = permissionGroups.flatMap((g) => g.items)

const inputStyle = {
  backgroundColor: THEME.inputBg,
  borderColor: THEME.inputBorder,
  color: THEME.inputText,
}

export default function AddRolePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] as string[] })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((p) => p !== id)
        : [...prev.permissions, id],
    }))
  }

  const toggleGroupAll = (group: typeof permissionGroups[0]) => {
    const ids = group.items.map((i) => i.id)
    const allSelected = ids.every((id) => formData.permissions.includes(id))
    setFormData((prev) => ({
      ...prev,
      permissions: allSelected ? prev.permissions.filter((p) => !ids.includes(p)) : [...new Set([...prev.permissions, ...ids])],
    }))
  }

  const toggleAll = () => {
    const all = allPermissions.map((p) => p.id)
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.length === all.length ? [] : all,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { toast.error('Role name is required'); return }
    if (formData.permissions.length === 0) { toast.error('Select at least one permission'); return }
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (response.ok) { toast.success('Role created successfully'); router.push('/systemadmin/roles') } else { toast.error('Failed to create role') }
    } catch { toast.error('An error occurred') } finally { setIsLoading(false) }
  }

  const allChecked = formData.permissions.length === allPermissions.length
  const checklist = [
    { label: 'Enter a valid role name', done: !!formData.name.trim() },
    { label: 'Select at least 1 permission', done: formData.permissions.length > 0 },
  ]

  return (
    <div className="space-y-6 min-h-screen p-6 rounded-xl" style={{ backgroundColor: THEME.mainBg }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: THEME.titleColor }} className="text-3xl font-bold tracking-tight">Create Role</h1>
          <p style={{ color: THEME.subtitleColor }} className="mt-1 text-sm">
            Configure a new role and establish its security boundaries.
          </p>
        </div>
        <Link href="/systemadmin/roles">
          <Button variant="outline" style={{ borderColor: THEME.border, backgroundColor: THEME.hover, color: THEME.titleColor }}
            className="gap-2 shadow-sm h-10 px-4 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Role Definitions
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* ── Role Details ── */}
        <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="xl:col-span-2 shadow-sm border">
          <CardHeader style={{ borderBottom: `1px solid ${THEME.border}` }} className="rounded-t-2xl px-6 py-5">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: THEME.hover }} className="p-2.5 rounded-xl border">
                <ShieldPlus className="w-5 h-5" style={{ color: THEME.titleColor }} />
              </div>
              <div>
                <CardTitle style={{ color: THEME.titleColor }} className="text-lg font-bold">Role Identity</CardTitle>
                <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
                  General details and permission configuration.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">

            {/* Name + Description area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl border shadow-sm" style={{ backgroundColor: THEME.mainBg, borderColor: THEME.border }}>
              <div className="space-y-2">
                <Label style={{ color: THEME.tableHeadText }} className="text-xs font-bold uppercase tracking-wide">
                  Role Name <span className="text-rose-500">*</span>
                </Label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Compliance Officer" style={inputStyle} className="text-sm shadow-sm h-11" />
              </div>
              <div className="space-y-2">
                <Label style={{ color: THEME.tableHeadText }} className="text-xs font-bold uppercase tracking-wide">Description</Label>
                <Input name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of responsibilities" style={inputStyle} className="text-sm shadow-sm h-11" />
              </div>
            </div>

            {/* Permissions area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: THEME.border }}>
                <Label style={{ color: THEME.titleColor }} className="text-base font-bold">
                  Access Controls <span className="text-sm font-normal opacity-70 ml-2">({formData.permissions.length}/{allPermissions.length} selected)</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={toggleAll}
                  style={{ color: THEME.titleColor, backgroundColor: THEME.hover, borderColor: THEME.border }} className="h-8 font-semibold">
                  {allChecked ? 'Deselect Everything' : 'Select Everything'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {permissionGroups.map((group) => {
                  const groupIds = group.items.map((i) => i.id)
                  const allGroupSelected = groupIds.every((id) => formData.permissions.includes(id))

                  return (
                    <div key={group.group} style={{ backgroundColor: THEME.mainBg, borderColor: THEME.border }} className="rounded-xl border shadow-sm overflow-hidden p-0">
                      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        <p style={{ color: THEME.titleColor }} className="text-xs font-bold uppercase tracking-wider">{group.group}</p>
                        <button type="button" onClick={() => toggleGroupAll(group)} className="text-[10px] font-bold uppercase w-12 py-1 rounded-md text-center transition-colors shadow-sm"
                          style={{ backgroundColor: allGroupSelected ? THEME.hover : THEME.mainBg, color: THEME.titleColor, border: `1px solid ${THEME.border}` }}>
                          {allGroupSelected ? 'None' : 'All'}
                        </button>
                      </div>

                      <div className="p-3 space-y-1">
                        {group.items.map((perm) => (
                          <label key={perm.id} htmlFor={`add-${perm.id}`} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: formData.permissions.includes(perm.id) ? THEME.hover : 'transparent' }}>
                            <Checkbox id={`add-${perm.id}`} checked={formData.permissions.includes(perm.id)} onCheckedChange={() => handlePermissionToggle(perm.id)} />
                            <span style={{ color: THEME.subtitleColor }} className="text-sm font-medium leading-none">{perm.label}</span>
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

        {/* ── Submit panel ── */}
        <div className="flex flex-col gap-5 sticky top-6">
          <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="shadow-sm border">
            <CardHeader style={{ borderBottom: `1px solid ${THEME.border}` }} className="rounded-t-2xl px-6 py-5">
              <CardTitle style={{ color: THEME.titleColor }} className="text-base font-bold">Checklist</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border shadow-sm" style={{ backgroundColor: THEME.mainBg, borderColor: THEME.border }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-inner"
                      style={{ backgroundColor: item.done ? THEME.titleColor : THEME.hover }}>
                      {item.done && (
                        <svg className="w-3 h-3 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span style={{ color: THEME.titleColor }} className="text-[13px] font-medium leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="h-px w-full" style={{ backgroundColor: THEME.border }} />

              <div className="space-y-3">
                <Button type="submit" disabled={isLoading} style={{ backgroundColor: THEME.titleColor, color: THEME.mainBg }}
                  className="w-full font-semibold gap-2 h-11 transition-all">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing…</> : <><CheckCircle2 className="w-5 h-5" /> Launch Role</>}
                </Button>

                <Link href="/systemadmin/roles" className="block">
                  <Button variant="outline" type="button" style={{ borderColor: THEME.border, color: THEME.titleColor, backgroundColor: THEME.hover }} className="w-full h-11 transition-all font-medium">
                    Cancel Process
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </form>
    </div>
  )
}

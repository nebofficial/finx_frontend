import Link from 'next/link'
import { Plus, Shield, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { THEME } from '@/lib/systemadmin-theme'
import RolesList from '@/components/systemadmin/roles/roles-list'
import PermissionsList from '@/components/systemadmin/roles/permissions-list'

export default function RolesPage() {
  return (
    <div className="space-y-6 min-h-screen p-6 rounded-xl" style={{ backgroundColor: THEME.mainBg }}>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: THEME.titleColor }} className="text-3xl font-bold tracking-tight">
            Roles &amp; Permissions
          </h1>
          <p style={{ color: THEME.subtitleColor }} className="mt-1 text-sm">
            Define system roles and control access across the platform.
          </p>
        </div>
        <Link href="/systemadmin/roles/add">
          <Button style={{ backgroundColor: THEME.hover, color: THEME.titleColor }} className="hover:opacity-80 gap-2 shadow-sm h-10 px-5 transition-all">
            <Plus size={18} />
            Add New Role
          </Button>
        </Link>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Roles List */}
        <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="shadow-sm border">
          <CardHeader
            style={{ borderBottom: `1px solid ${THEME.border}` }}
            className="rounded-t-2xl px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: THEME.hover }} className="p-2.5 rounded-xl border">
                <Shield className="w-5 h-5" style={{ color: THEME.titleColor }} />
              </div>
              <div>
                <CardTitle style={{ color: THEME.titleColor }} className="text-lg font-bold">System Roles</CardTitle>
                <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
                  Manage active roles and their assigned scopes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <RolesList />
          </CardContent>
        </Card>

        {/* Permissions Overview */}
        <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="shadow-sm border">
          <CardHeader
            style={{ borderBottom: `1px solid ${THEME.border}` }}
            className="rounded-t-2xl px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: THEME.hover }} className="p-2.5 rounded-xl border">
                <Key className="w-5 h-5" style={{ color: THEME.titleColor }} />
              </div>
              <div>
                <CardTitle style={{ color: THEME.titleColor }} className="text-lg font-bold">Available Permissions</CardTitle>
                <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
                  View the master list of all granular platform permissions.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <PermissionsList />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

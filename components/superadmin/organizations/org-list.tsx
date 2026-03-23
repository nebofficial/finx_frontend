'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit2, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

type TenantRow = {
  id: string
  name: string
  email: string
  phone?: string | null
  status?: string
  createdAt?: string
}

export default function OrgList() {
  const [tenant, setTenant] = useState<TenantRow | null>(null)
  const [planName, setPlanName] = useState<string>('—')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [orgRes, subRes] = await Promise.allSettled([
        superAdminApi.getOrganization(),
        superAdminApi.getSubscription(),
      ])
      const org =
        orgRes.status === 'fulfilled' ? (orgRes.value.data?.data?.organization as TenantRow | undefined) : undefined
      setTenant(org || null)
      if (orgRes.status === 'rejected') {
        toast.error('Failed to load organization.')
      }
      const plan =
        subRes.status === 'fulfilled' ? subRes.value.data?.data?.subscription?.plan : undefined
      setPlanName(plan?.name ? String(plan.name) : '—')
    } catch {
      toast.error('Failed to load organization.')
      setTenant(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <Card className="p-8 flex items-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading organization…
      </Card>
    )
  }

  if (!tenant) {
    return (
      <Card className="p-8 text-center text-gray-600 text-sm">
        No organization data. Sign in as a tenant SuperAdmin with a valid tenant context.
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Cooperative</TableHead>
            <TableHead className="text-gray-700 font-semibold">Contact email</TableHead>
            <TableHead className="text-gray-700 font-semibold">Plan</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-gray-700 font-semibold">Created</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-gray-100 hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">{tenant.name}</TableCell>
            <TableCell className="text-gray-600">{tenant.email}</TableCell>
            <TableCell>
              <Badge className="bg-blue-100 text-blue-800">{planName}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  tenant.status === 'active' || tenant.status === 'trial'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {tenant.status || '—'}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-600 text-sm">
              {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '—'}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/superadmin/organizations/${tenant.id}`} className="cursor-pointer flex items-center">
                      <Eye size={16} className="mr-2" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/superadmin/organizations/${tenant.id}/edit`} className="cursor-pointer flex items-center">
                      <Edit2 size={16} className="mr-2" />
                      Edit settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="text-xs text-gray-500 px-4 py-3 border-t">
        New cooperatives are provisioned from System Admin → Tenants.
      </p>
    </Card>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  is_active?: boolean
}

export default function OrgAdminSelector() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superAdminApi.listUsers({ limit: 200 })
      const list = (res.data?.data?.users || []) as UserRow[]
      const admins = list.filter((u) => ['SuperAdmin', 'Admin', 'BranchAdmin'].includes(u.role))
      setUsers(admins)
    } catch {
      toast.error('Failed to load users.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading administrators…
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        No admin users found. Invite staff from{' '}
        <Link href="/admin/members" className="text-primary underline">
          Members
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Tenant users with elevated roles (from <code className="text-xs bg-gray-100 px-1 rounded">GET /super-admin/users</code>
        ). There is no API to reassign a single “organization admin” identity; manage accounts in Members.
      </p>
      <div className="space-y-2">
        {users.map((u) => (
          <Card key={u.id} className="p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{u.role}</Badge>
              {u.is_active === false && (
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href="/admin/members">Open member management</Link>
      </Button>
    </div>
  )
}

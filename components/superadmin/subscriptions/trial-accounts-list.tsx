'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { differenceInDays } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clock, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

export default function TrialAccountsList() {
  const [loading, setLoading] = useState(true)
  const [isTrial, setIsTrial] = useState(false)
  const [orgName, setOrgName] = useState('—')
  const [trialEnds, setTrialEnds] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [orgRes, subRes] = await Promise.allSettled([
        superAdminApi.getOrganization(),
        superAdminApi.getSubscription(),
      ])
      const org =
        orgRes.status === 'fulfilled'
          ? (orgRes.value.data?.data?.organization as { name?: string; trial_ends_at?: string | null } | undefined)
          : undefined
      const tenantStatus =
        subRes.status === 'fulfilled' ? String(subRes.value.data?.data?.tenant_status || '') : ''
      const te =
        subRes.status === 'fulfilled'
          ? subRes.value.data?.data?.trial_ends_at
          : undefined
      const teFromOrg = org?.trial_ends_at
      setOrgName(org?.name || '—')
      setTrialEnds((te ?? teFromOrg) ? String(te ?? teFromOrg) : null)
      setIsTrial(tenantStatus === 'trial' || !!te)
    } catch {
      toast.error('Failed to load trial status.')
      setIsTrial(false)
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
        Loading…
      </Card>
    )
  }

  if (!isTrial && !trialEnds) {
    return (
      <Card className="p-8 text-center text-gray-600 text-sm">
        This tenant is not on a trial window (or no trial end date is set). Multi-tenant trial analytics are available in System Admin.
        <div className="mt-4">
          <Link href="/systemadmin/tenants" className="text-primary text-sm font-medium hover:underline">
            Open platform tenants
          </Link>
        </div>
      </Card>
    )
  }

  const end = trialEnds ? new Date(trialEnds) : null
  const daysLeft =
    end && !Number.isNaN(end.getTime()) ? differenceInDays(end, new Date()) : null
  const expired = daysLeft != null && daysLeft < 0

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Cooperative</TableHead>
            <TableHead className="text-gray-700 font-semibold">Trial ends</TableHead>
            <TableHead className="text-gray-700 font-semibold">Days left</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-gray-100 hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">{orgName}</TableCell>
            <TableCell className="text-gray-600">
              {end ? end.toLocaleDateString() : '—'}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  expired
                    ? 'bg-red-100 text-red-800'
                    : daysLeft != null && daysLeft <= 7
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }
              >
                <Clock size={12} className="mr-1 inline" />
                {daysLeft == null ? '—' : expired ? 'Ended' : `${daysLeft} days`}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={expired ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}>
                {expired ? 'Ended' : 'Active'}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}

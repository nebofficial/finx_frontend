'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

export default function SubscriptionsList() {
  const [loading, setLoading] = useState(true)
  const [orgName, setOrgName] = useState('')
  const [planName, setPlanName] = useState('—')
  const [amount, setAmount] = useState<number | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [autoRenew, setAutoRenew] = useState<boolean | null>(null)
  const [status, setStatus] = useState<string>('—')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [orgRes, subRes] = await Promise.allSettled([
        superAdminApi.getOrganization(),
        superAdminApi.getSubscription(),
      ])
      const org =
        orgRes.status === 'fulfilled' ? (orgRes.value.data?.data?.organization as { name?: string } | undefined) : undefined
      setOrgName(org?.name || '—')
      const sub =
        subRes.status === 'fulfilled'
          ? (subRes.value.data?.data?.subscription as
        | {
            status?: string
            amount?: number | string
            end_date?: string
            next_billing_date?: string
            auto_renew?: boolean
            plan?: { name?: string; price_monthly?: number }
          }
        | null)
          : null
      if (!sub) {
        setPlanName('—')
        setAmount(null)
        setEndDate(null)
        setAutoRenew(null)
        setStatus('—')
        return
      }
      setPlanName(sub.plan?.name ? String(sub.plan.name) : '—')
      setAmount(sub.amount != null ? Number(sub.amount) : Number(sub.plan?.price_monthly ?? 0))
      setEndDate(sub.end_date ? String(sub.end_date) : sub.next_billing_date ? String(sub.next_billing_date) : null)
      setAutoRenew(typeof sub.auto_renew === 'boolean' ? sub.auto_renew : null)
      setStatus(String(sub.status || '—'))
    } catch {
      toast.error('Failed to load subscription.')
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

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Cooperative</TableHead>
            <TableHead className="text-gray-700 font-semibold">Plan</TableHead>
            <TableHead className="text-gray-700 font-semibold">Amount</TableHead>
            <TableHead className="text-gray-700 font-semibold">End / next bill</TableHead>
            <TableHead className="text-gray-700 font-semibold">Auto-renew</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Platform</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-gray-100 hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">{orgName}</TableCell>
            <TableCell>
              <Badge className="bg-purple-100 text-purple-800 capitalize">{planName}</Badge>
            </TableCell>
            <TableCell className="font-medium text-gray-900">
              {amount != null && Number.isFinite(amount) ? `$${amount.toFixed(2)}` : '—'}
            </TableCell>
            <TableCell className="text-gray-600">
              {endDate ? new Date(endDate).toLocaleDateString() : '—'}
            </TableCell>
            <TableCell>
              <Badge className={autoRenew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {autoRenew == null ? '—' : autoRenew ? 'On' : 'Off'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className="bg-green-100 text-green-800 capitalize">{status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Link href="/systemadmin/billing/plans" className="text-sm text-primary hover:underline">
                Manage plans
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="text-xs text-gray-500 px-4 py-3 border-t">
        One row per signed-in tenant. Platform operators manage catalog in System Admin → Billing.
      </p>
    </Card>
  )
}

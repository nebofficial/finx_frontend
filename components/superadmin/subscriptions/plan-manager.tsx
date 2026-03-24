'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

export default function PlanManager() {
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<{
    name?: string
    price_monthly?: number
    price_yearly?: number
    max_users?: number
    max_branches?: number
    trial_days?: number
  } | null>(null)
  const [tenantStatus, setTenantStatus] = useState<string>('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superAdminApi.getSubscription()
      const p = res.data?.data?.subscription?.plan
      setPlan(p ? { ...p } : null)
      setTenantStatus(String(res.data?.data?.tenant_status || ''))
    } catch {
      toast.error('Failed to load subscription.')
      setPlan(null)
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
        Loading subscription…
      </Card>
    )
  }

  if (!plan) {
    return (
      <Card className="p-8 space-y-3">
        <p className="text-gray-800 font-medium">No active subscription record found.</p>
        <p className="text-sm text-gray-600">
          Plans are assigned on the platform. If you are a system operator, manage billing in System Admin.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/systemadmin/billing/plans">Open platform billing</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
            {tenantStatus && (
              <p className="text-sm text-gray-600 mt-1">
                Tenant status:{' '}
                <Badge variant="outline" className="ml-1">
                  {tenantStatus}
                </Badge>
              </p>
            )}
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/systemadmin/billing/plans">Platform plan catalog</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Monthly</p>
            <p className="font-semibold text-gray-900">रू {Number(plan.price_monthly ?? 0)}</p>
          </div>
          <div>
            <p className="text-gray-500">Yearly</p>
            <p className="font-semibold text-gray-900">रू {Number(plan.price_yearly ?? 0)}</p>
          </div>
          <div>
            <p className="text-gray-500">Trial days</p>
            <p className="font-semibold text-gray-900">{plan.trial_days ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Max users</p>
            <p className="font-semibold text-gray-900">{plan.max_users ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Max branches</p>
            <p className="font-semibold text-gray-900">{plan.max_branches ?? '—'}</p>
          </div>
        </div>
      </Card>
      <p className="text-xs text-gray-500 px-1">
        Creating or editing global plans is limited to System Admin. This screen shows the plan linked to your tenant subscription.
      </p>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OrgAdminSelector from '@/components/superadmin/organizations/org-admin-selector'
import { ChevronLeft, Edit2, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

type TenantRow = {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  logo_url?: string | null
  status?: string
  slug?: string
  trial_ends_at?: string | null
  createdAt?: string
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : ''

  const [loading, setLoading] = useState(true)
  const [tenant, setTenant] = useState<TenantRow | null>(null)
  const [planName, setPlanName] = useState('—')
  const [subEnd, setSubEnd] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [orgRes, subRes] = await Promise.all([
        superAdminApi.getOrganization(),
        superAdminApi.getSubscription(),
      ])
      const org = orgRes.data?.data?.organization as TenantRow | undefined
      if (!org || org.id !== id) {
        toast.error('Organization not found for this URL.')
        router.replace('/superadmin/organizations')
        return
      }
      setTenant(org)
      const plan = subRes.data?.data?.subscription?.plan
      setPlanName(plan?.name ? String(plan.name) : '—')
      const end = subRes.data?.data?.subscription?.end_date
      setSubEnd(end ? String(end) : null)
    } catch {
      toast.error('Failed to load organization.')
      router.replace('/superadmin/organizations')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    void load()
  }, [load])

  if (loading || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/superadmin/organizations">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
              <Badge
                className={
                  tenant.status === 'active' || tenant.status === 'trial'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {tenant.status || '—'}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {tenant.email}
              {tenant.phone ? ` • ${tenant.phone}` : ''}
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href={`/superadmin/organizations/${tenant.id}/edit`}>
            <Edit2 size={16} />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Plan</p>
          <p className="text-2xl font-bold text-primary mt-1 capitalize">{planName}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Slug</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{tenant.slug || '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Member since</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '—'}
          </p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Admins &amp; staff</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Logo URL</label>
                <p className="text-gray-900 mt-1 break-all">{tenant.logo_url || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{tenant.address || '—'}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Elevated roles</h2>
            <OrgAdminSelector />
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Current plan</label>
                <p className="text-gray-900 mt-1 capitalize font-semibold">{planName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Next / end billing</label>
                <p className="text-gray-900 mt-1">{subEnd ? new Date(subEnd).toLocaleDateString() : '—'}</p>
              </div>
              {tenant.trial_ends_at && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Trial ends</label>
                  <p className="text-gray-900 mt-1">{new Date(tenant.trial_ends_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

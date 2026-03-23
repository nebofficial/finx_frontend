'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'

export default function DashboardHeader() {
  const [orgName, setOrgName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superAdminApi.getOrganization()
      const org = res.data?.data?.organization as { name?: string } | undefined
      setOrgName(org?.name?.trim() || null)
    } catch {
      setOrgName(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading cooperative…
              </span>
            ) : orgName ? (
              <>Welcome back. You are managing <span className="font-medium text-card-foreground">{orgName}</span>.</>
            ) : (
              <>Welcome back. Monitor users, subscription, and support for this cooperative.</>
            )}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shrink-0" asChild>
          <a href="/superadmin/support">
            <ArrowUpRight size={16} className="mr-2" />
            Support
          </a>
        </Button>
      </div>
    </div>
  )
}

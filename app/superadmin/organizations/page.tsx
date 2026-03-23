'use client'

import Link from 'next/link'
import OrgList from '@/components/superadmin/organizations/org-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your cooperative</h1>
          <p className="text-gray-600 text-sm mt-1">Profile and subscription for the tenant you are signed into</p>
        </div>
        <Link href="/systemadmin/tenants/provision">
          <Button className="bg-primary hover:bg-primary/90" variant="outline">
            <Plus size={16} className="mr-2" />
            Provision new tenant (platform)
          </Button>
        </Link>
      </div>

      <Card className="p-4 text-sm text-gray-600 border-dashed">
        This screen reflects <strong>one</strong> cooperative per login. Multi-tenant provisioning is done in System Admin.
      </Card>

      <OrgList />
    </div>
  )
}

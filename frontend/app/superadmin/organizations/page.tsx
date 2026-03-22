'use client'

import { useState } from 'react'
import Link from 'next/link'
import OrgList from '@/components/superadmin/organizations/org-list'
import OrgFilters from '@/components/superadmin/organizations/org-filters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function OrganizationsPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    plan: 'all'
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 text-sm mt-1">Manage all cooperative organizations and their settings</p>
        </div>
        <Link href="/superadmin/organizations/add">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Add Organization
          </Button>
        </Link>
      </div>

      <OrgFilters filters={filters} onFiltersChange={setFilters} />
      <OrgList filters={filters} />
    </div>
  )
}

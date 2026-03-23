'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AuditLogTable from '@/components/superadmin/audit/audit-log-table'
import AuditFilters from '@/components/superadmin/audit/audit-filters'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

export default function AuditLogsPage() {
  const [filters, setFilters] = useState({
    source: 'all',
    search: '',
    dateRange: 'all',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/audit">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 text-sm mt-1">Complete system activity logs with search and filtering</p>
        </div>
      </div>

      <AuditFilters filters={filters} onFiltersChange={setFilters} />
      <AuditLogTable filters={filters} />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import SupportStats from '@/components/superadmin/support/support-stats'
import TicketsList from '@/components/superadmin/support/tickets-list'
import TicketFilters from '@/components/superadmin/support/ticket-filters'
import { Plus } from 'lucide-react'

export default function SupportPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    organization: 'all'
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 text-sm mt-1">Manage and resolve all support tickets from cooperatives</p>
        </div>
        <Link href="/superadmin/support/tickets/add">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      <SupportStats />
      
      <TicketFilters filters={filters} onFiltersChange={setFilters} />
      
      <TicketsList filters={filters} />
    </div>
  )
}

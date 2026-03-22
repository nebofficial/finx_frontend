'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AlertsList from '@/components/superadmin/notifications/alerts-list'
import { Plus, ChevronLeft } from 'lucide-react'

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/superadmin/notifications">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
            <p className="text-gray-600 text-sm mt-1">Manage maintenance and billing alerts</p>
          </div>
        </div>
        <Link href="/superadmin/notifications/alerts/add">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            New Alert
          </Button>
        </Link>
      </div>

      <AlertsList />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TrialAccountsList from '@/components/superadmin/subscriptions/trial-accounts-list'
import { Plus, ChevronLeft } from 'lucide-react'

export default function TrialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/superadmin/subscriptions">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trial Accounts</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and configure trial periods for new organizations</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          Create Trial
        </Button>
      </div>

      <TrialAccountsList />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PlanManager from '@/components/superadmin/subscriptions/plan-manager'
import { Plus, ChevronLeft } from 'lucide-react'

export default function PlansPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600 text-sm mt-1">Create and manage subscription plans</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          New Plan
        </Button>
      </div>

      <PlanManager />
    </div>
  )
}

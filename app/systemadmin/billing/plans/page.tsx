'use client'

import PlansList from '@/components/systemadmin/billing/plans-list'
import BillingStats from '@/components/systemadmin/billing/billing-stats'

export default function BillingPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">Manage and configure pricing tiers</p>
      </div>
      <BillingStats />
      <PlansList />
    </div>
  )
}

import PlansList from '@/components/systemadmin/billing/plans-list'
import SubscriptionsList from '@/components/systemadmin/billing/subscriptions-list'
import BillingStats from '@/components/systemadmin/billing/billing-stats'

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage subscription plans and billing</p>
      </div>

      <BillingStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlansList />
        <SubscriptionsList />
      </div>
    </div>
  )
}

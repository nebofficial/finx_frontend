'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubscriptionStats from '@/components/superadmin/subscriptions/subscription-stats'
import TrialAccountsList from '@/components/superadmin/subscriptions/trial-accounts-list'
import SubscriptionsList from '@/components/superadmin/subscriptions/subscriptions-list'
import PlanManager from '@/components/superadmin/subscriptions/plan-manager'

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions & Trials</h1>
        <p className="text-gray-600 text-sm mt-1">Manage subscription plans, trials, and expiry dates</p>
      </div>

      <SubscriptionStats />

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="trials">Trials</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionsList />
        </TabsContent>

        <TabsContent value="trials" className="space-y-4">
          <TrialAccountsList />
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <PlanManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

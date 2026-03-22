'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Edit, Trash2, Plus } from 'lucide-react'

export default function BillingPlansPage() {
  const plans = [
    {
      id: 'trial',
      name: 'Trial',
      description: 'For testing purposes',
      price: '$0',
      billingCycle: '30 days',
      users: '5',
      features: [
        'Up to 5 users',
        '1GB storage',
        'Basic support',
        'Limited API calls',
      ],
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For small teams',
      price: '$49',
      billingCycle: 'per month',
      users: '25',
      features: [
        'Up to 25 users',
        '100GB storage',
        'Email support',
        '10K API calls/day',
        'Basic analytics',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For growing businesses',
      price: '$149',
      billingCycle: 'per month',
      users: '100',
      features: [
        'Up to 100 users',
        '1TB storage',
        'Priority support',
        '100K API calls/day',
        'Advanced analytics',
        'Custom branding',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 'Custom',
      billingCycle: 'contact sales',
      users: 'Unlimited',
      features: [
        'Unlimited users',
        'Unlimited storage',
        '24/7 phone support',
        'Unlimited API calls',
        'Advanced analytics',
        'Custom branding',
        'SSO & SAML',
        'Dedicated account manager',
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Subscription Plans</h1>
          <p className="text-muted-foreground mt-2">Manage and configure pricing tiers</p>
        </div>
        <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-card-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <p className="text-3xl font-bold text-primary mt-3">{plan.price}</p>
              <p className="text-xs text-muted-foreground">{plan.billingCycle}</p>
            </div>

            <div className="mb-6 flex-1">
              <p className="text-sm font-semibold text-card-foreground mb-3">Max Users: {plan.users}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-card-foreground">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary-light text-primary-foreground">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button className="flex-1 border border-border-light text-card-foreground bg-white hover:bg-muted">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Plan Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tenants', value: '156' },
            { label: 'Trial Users', value: '23' },
            { label: 'Paid Users', value: '133' },
            { label: 'MRR', value: '$47,293' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

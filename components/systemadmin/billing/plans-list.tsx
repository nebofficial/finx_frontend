'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Plan {
  id: string
  name: string
  price: number
  billing: 'monthly' | 'annual'
  features: number
  users: number
  status: 'active' | 'archived'
}

const plans: Plan[] = [
  {
    id: '1',
    name: 'Starter',
    price: 29,
    billing: 'monthly',
    features: 5,
    users: 12,
    status: 'active',
  },
  {
    id: '2',
    name: 'Professional',
    price: 99,
    billing: 'monthly',
    features: 15,
    users: 8,
    status: 'active',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 299,
    billing: 'monthly',
    features: 30,
    users: 48,
    status: 'active',
  },
  {
    id: '4',
    name: 'Legacy',
    price: 49,
    billing: 'monthly',
    features: 8,
    users: 2,
    status: 'archived',
  },
]

export default function PlansList() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Subscription Plans</CardTitle>
        <Button className="bg-primary hover:bg-green-700 text-primary-foreground h-8 text-sm">
          New Plan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-card-foreground">{plan.name}</h3>
                  <Badge className={plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {plan.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>${plan.price}/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span>
                  <span>{plan.features} features</span>
                  <span>{plan.users} subscriptions</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit size={16} className="mr-2" />
                    <span>Edit Plan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <Trash2 size={16} className="mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

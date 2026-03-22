'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Eye, Edit } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Subscription {
  id: string
  tenant: string
  plan: string
  status: 'active' | 'expiring' | 'cancelled'
  nextRenewal: string
  mrr: number
}

const subscriptions: Subscription[] = [
  {
    id: '1',
    tenant: 'Acme Corporation',
    plan: 'Enterprise',
    status: 'active',
    nextRenewal: 'Apr 15, 2024',
    mrr: 299,
  },
  {
    id: '2',
    tenant: 'Tech Startup Inc',
    plan: 'Professional',
    status: 'active',
    nextRenewal: 'Mar 20, 2024',
    mrr: 99,
  },
  {
    id: '3',
    tenant: 'Global Solutions',
    plan: 'Enterprise',
    status: 'active',
    nextRenewal: 'Mar 10, 2024',
    mrr: 299,
  },
  {
    id: '4',
    tenant: 'Creative Agency',
    plan: 'Starter',
    status: 'expiring',
    nextRenewal: 'Mar 5, 2024',
    mrr: 29,
  },
  {
    id: '5',
    tenant: 'Legacy Systems',
    plan: 'Professional',
    status: 'cancelled',
    nextRenewal: 'Feb 28, 2024',
    mrr: 0,
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  expiring: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function SubscriptionsList() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Active Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-card-foreground">{sub.tenant}</h3>
                  <Badge className={statusColors[sub.status]}>
                    {sub.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{sub.plan} Plan</span>
                  <span>MRR: ${sub.mrr}</span>
                  <span>Renews: {sub.nextRenewal}</span>
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
                    <Eye size={16} className="mr-2" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit size={16} className="mr-2" />
                    <span>Manage</span>
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

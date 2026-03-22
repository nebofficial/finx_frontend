'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit2, Trash2, CheckCircle2 } from 'lucide-react'

const mockPlans = [
  {
    id: '1',
    name: 'Trial',
    monthlyPrice: 0,
    annualPrice: 0,
    description: '14-day free trial',
    users: 'Unlimited',
    storage: '5 GB',
    features: ['Basic reporting', 'Email support'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Starter',
    monthlyPrice: 99,
    annualPrice: 990,
    description: 'For small cooperatives',
    users: 'Up to 10',
    storage: '50 GB',
    features: ['Advanced reporting', 'Priority support', 'API access'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Premium',
    monthlyPrice: 299,
    annualPrice: 2990,
    description: 'For growing cooperatives',
    users: 'Up to 50',
    storage: '500 GB',
    features: ['All Starter features', 'Custom branding', 'Dedicated support'],
    status: 'active'
  },
  {
    id: '4',
    name: 'Enterprise',
    monthlyPrice: 799,
    annualPrice: 7990,
    description: 'For large organizations',
    users: 'Unlimited',
    storage: 'Unlimited',
    features: ['All Premium features', 'SLA', 'Custom integrations'],
    status: 'active'
  },
]

export default function PlanManager() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Plan Name</TableHead>
            <TableHead className="text-gray-700 font-semibold">Monthly Price</TableHead>
            <TableHead className="text-gray-700 font-semibold">Users</TableHead>
            <TableHead className="text-gray-700 font-semibold">Storage</TableHead>
            <TableHead className="text-gray-700 font-semibold">Features</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPlans.map((plan) => (
            <TableRow key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-600">{plan.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">${plan.monthlyPrice}</p>
                  <p className="text-xs text-gray-600">${plan.annualPrice}/yr</p>
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{plan.users}</TableCell>
              <TableCell className="text-gray-600">{plan.storage}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap max-w-xs">
                  {plan.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                  ))}
                  {plan.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">+{plan.features.length - 2}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                  <CheckCircle2 size={12} />
                  Active
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit2 size={16} className="mr-2" />
                      Edit Plan
                    </DropdownMenuItem>
                    {plan.name !== 'Trial' && (
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        <Trash2 size={16} className="mr-2" />
                        Delete Plan
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

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
import { MoreHorizontal, Eye, Edit2, AlertCircle } from 'lucide-react'

const mockSubscriptions = [
  {
    id: '1',
    organization: 'Green Valley Coop',
    plan: 'premium',
    price: '$299/mo',
    startDate: '2024-01-15',
    renewalDate: '2025-01-15',
    status: 'active',
    autoRenewal: true
  },
  {
    id: '2',
    organization: 'Mountain Ridge Coop',
    plan: 'starter',
    price: '$99/mo',
    startDate: '2024-03-10',
    renewalDate: '2025-03-10',
    status: 'active',
    autoRenewal: true
  },
  {
    id: '3',
    organization: 'Riverside Farm Coop',
    plan: 'enterprise',
    price: '$799/mo',
    startDate: '2023-12-05',
    renewalDate: '2024-12-05',
    status: 'active',
    autoRenewal: true
  },
  {
    id: '4',
    organization: 'Valley Trees Coop',
    plan: 'premium',
    price: '$299/mo',
    startDate: '2024-02-01',
    renewalDate: '2024-05-01',
    status: 'expiring-soon',
    autoRenewal: false
  },
]

export default function SubscriptionsList() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Organization</TableHead>
            <TableHead className="text-gray-700 font-semibold">Plan</TableHead>
            <TableHead className="text-gray-700 font-semibold">Monthly Fee</TableHead>
            <TableHead className="text-gray-700 font-semibold">Renewal Date</TableHead>
            <TableHead className="text-gray-700 font-semibold">Auto-Renewal</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSubscriptions.map((sub) => (
            <TableRow key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{sub.organization}</TableCell>
              <TableCell>
                <Badge className={
                  sub.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                  sub.plan === 'starter' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-900">{sub.price}</TableCell>
              <TableCell className="text-gray-600">{new Date(sub.renewalDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge className={sub.autoRenewal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {sub.autoRenewal ? 'Enabled' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell>
                {sub.status === 'expiring-soon' ? (
                  <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                    <AlertCircle size={12} />
                    Expiring Soon
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                )}
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
                      <Eye size={16} className="mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit2 size={16} className="mr-2" />
                      Upgrade Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      Cancel Subscription
                    </DropdownMenuItem>
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

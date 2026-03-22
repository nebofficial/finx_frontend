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
import { MoreHorizontal, Eye, Edit2, Trash2, Clock } from 'lucide-react'

const mockTrials = [
  {
    id: '1',
    organization: 'Urban Farmers Coop',
    duration: '14 days',
    startDate: '2024-03-10',
    endDate: '2024-03-24',
    daysLeft: 5,
    status: 'active',
    features: 'All features'
  },
  {
    id: '2',
    organization: 'Tech Innovations Lab',
    duration: '30 days',
    startDate: '2024-02-25',
    endDate: '2024-03-26',
    daysLeft: 7,
    status: 'active',
    features: 'Premium features'
  },
  {
    id: '3',
    organization: 'Community Gardens',
    duration: '7 days',
    startDate: '2024-03-12',
    endDate: '2024-03-19',
    daysLeft: 0,
    status: 'expired',
    features: 'Basic features'
  },
  {
    id: '4',
    organization: 'Organic Producers',
    duration: '14 days',
    startDate: '2024-03-17',
    endDate: '2024-03-31',
    daysLeft: 12,
    status: 'active',
    features: 'All features'
  },
]

export default function TrialAccountsList() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Organization</TableHead>
            <TableHead className="text-gray-700 font-semibold">Start Date</TableHead>
            <TableHead className="text-gray-700 font-semibold">End Date</TableHead>
            <TableHead className="text-gray-700 font-semibold">Days Left</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-gray-700 font-semibold">Features</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTrials.map((trial) => {
            const daysLeftColor = trial.daysLeft > 7 ? 'bg-green-100 text-green-800' : 
                                  trial.daysLeft > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
            
            return (
              <TableRow key={trial.id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{trial.organization}</TableCell>
                <TableCell className="text-gray-600">{new Date(trial.startDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-gray-600">{new Date(trial.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={daysLeftColor}>
                    <Clock size={12} className="mr-1" />
                    {trial.daysLeft > 0 ? `${trial.daysLeft} days` : 'Expired'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={trial.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {trial.status.charAt(0).toUpperCase() + trial.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">{trial.features}</TableCell>
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
                        Extend Trial
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-green-600">
                        Convert to Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        <Trash2 size={16} className="mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

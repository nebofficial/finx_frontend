'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const mockLogs = [
  {
    id: '1',
    timestamp: '2024-03-15T14:32:00Z',
    action: 'Organization Created',
    organization: 'Tech Innovations Lab',
    user: 'admin@system.local',
    description: 'New organization created with trial plan',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2024-03-15T13:15:30Z',
    action: 'Subscription Upgraded',
    organization: 'Green Valley Coop',
    user: 'support@system.local',
    description: 'Plan upgraded from Starter to Premium',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2024-03-15T12:48:15Z',
    action: 'Organization Admin Changed',
    organization: 'Urban Farmers Coop',
    user: 'admin@system.local',
    description: 'New admin assigned',
    status: 'success'
  },
  {
    id: '4',
    timestamp: '2024-03-15T11:22:45Z',
    action: 'Trial Extended',
    organization: 'Mountain Ridge Coop',
    user: 'support@system.local',
    description: 'Trial period extended by 14 days',
    status: 'success'
  },
  {
    id: '5',
    timestamp: '2024-03-15T10:05:20Z',
    action: 'Failed Login Attempt',
    organization: 'Riverside Farm Coop',
    user: 'invalid_user@riverside.coop',
    description: '3 failed login attempts',
    status: 'warning'
  },
]

export default function AuditLogTable({ filters }: { filters: any }) {
  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-700 font-semibold">Timestamp</TableHead>
              <TableHead className="text-gray-700 font-semibold">Action</TableHead>
              <TableHead className="text-gray-700 font-semibold">Organization</TableHead>
              <TableHead className="text-gray-700 font-semibold">User</TableHead>
              <TableHead className="text-gray-700 font-semibold">Description</TableHead>
              <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLogs.map((log) => (
              <TableRow key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell className="text-gray-600 text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell className="font-medium text-gray-900">{log.action}</TableCell>
                <TableCell className="text-gray-600">{log.organization}</TableCell>
                <TableCell className="text-gray-600 text-sm">{log.user}</TableCell>
                <TableCell className="text-gray-600 text-sm">{log.description}</TableCell>
                <TableCell>
                  <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  )
}

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
import { Check, X } from 'lucide-react'

const mockLogins = [
  {
    id: '1',
    email: 'john.smith@greenvalley.coop',
    organization: 'Green Valley Coop',
    ip: '192.168.1.100',
    timestamp: '2024-03-15T14:30:00Z',
    status: 'success',
    device: 'Chrome on Windows'
  },
  {
    id: '2',
    email: 'sarah.johnson@urbanfarmers.coop',
    organization: 'Urban Farmers Coop',
    ip: '10.0.0.50',
    timestamp: '2024-03-15T13:45:30Z',
    status: 'success',
    device: 'Safari on macOS'
  },
  {
    id: '3',
    email: 'invalid_user@riverside.coop',
    organization: 'Riverside Farm Coop',
    ip: '203.0.113.45',
    timestamp: '2024-03-15T10:05:00Z',
    status: 'failed',
    device: 'Chrome on Linux'
  },
  {
    id: '4',
    email: 'michael.brown@mountainridge.coop',
    organization: 'Mountain Ridge Coop',
    ip: '198.51.100.20',
    timestamp: '2024-03-15T09:30:15Z',
    status: 'success',
    device: 'Firefox on Windows'
  },
]

export default function LoginActivity() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Email</TableHead>
            <TableHead className="text-gray-700 font-semibold">Organization</TableHead>
            <TableHead className="text-gray-700 font-semibold">IP Address</TableHead>
            <TableHead className="text-gray-700 font-semibold">Device</TableHead>
            <TableHead className="text-gray-700 font-semibold">Timestamp</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogins.map((login) => (
            <TableRow key={login.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{login.email}</TableCell>
              <TableCell className="text-gray-600">{login.organization}</TableCell>
              <TableCell className="text-gray-600 font-mono text-sm">{login.ip}</TableCell>
              <TableCell className="text-gray-600 text-sm">{login.device}</TableCell>
              <TableCell className="text-gray-600 text-sm">{new Date(login.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                {login.status === 'success' ? (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                    <Check size={12} />
                    Success
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                    <X size={12} />
                    Failed
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

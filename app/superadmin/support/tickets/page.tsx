'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TicketDetails from '@/components/superadmin/support/ticket-details'
import TicketResponseForm from '@/components/superadmin/support/ticket-response-form'
import ImpersonationModal from '@/components/superadmin/support/impersonation-modal'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

export default function TicketDetailPage() {
  const [showImpersonate, setShowImpersonate] = useState(false)

  const mockTicket = {
    id: '#2847',
    subject: 'Cannot access billing reports',
    status: 'open',
    priority: 'high',
    organization: 'Green Valley Coop',
    organizationId: '1',
    assignee: 'John Support',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T14:20:00Z',
    description: 'We are unable to access the billing reports section. The page loads but shows an error when we try to filter by date range.',
    messages: [
      {
        id: '1',
        author: 'Sarah Johnson',
        role: 'Organization Admin',
        content: 'We are unable to access the billing reports section. The page loads but shows an error when we try to filter by date range.',
        timestamp: '2024-03-15T10:30:00Z',
        type: 'user'
      },
      {
        id: '2',
        author: 'John Support',
        role: 'Support Agent',
        content: 'Thank you for reporting this issue. I will investigate this immediately. Could you please provide the error message you are seeing?',
        timestamp: '2024-03-15T11:15:00Z',
        type: 'support'
      },
      {
        id: '3',
        author: 'Sarah Johnson',
        role: 'Organization Admin',
        content: 'The error message says "Invalid date format". We are using the standard date picker provided in the interface.',
        timestamp: '2024-03-15T13:45:00Z',
        type: 'user'
      }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/superadmin/support">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{mockTicket.subject}</h1>
              <Badge className={
                mockTicket.priority === 'high' ? 'bg-red-100 text-red-800' :
                mockTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }>
                {mockTicket.priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mt-1">Ticket {mockTicket.id} • {mockTicket.organization}</p>
          </div>
        </div>
        <Button onClick={() => setShowImpersonate(true)} variant="outline">
          Login as Admin
        </Button>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Status</p>
          <Badge className="mt-2 bg-green-100 text-green-800">{mockTicket.status.toUpperCase()}</Badge>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Assigned To</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{mockTicket.assignee}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Created</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{new Date(mockTicket.createdAt).toLocaleDateString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Last Updated</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{new Date(mockTicket.updatedAt).toLocaleDateString()}</p>
        </Card>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TicketDetails ticket={mockTicket} />
          <TicketResponseForm ticketId={mockTicket.id} />
        </div>
        <div>
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ticket Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Status</p>
                <p className="text-gray-900 mt-1 capitalize">{mockTicket.status}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Priority</p>
                <p className="text-gray-900 mt-1 capitalize">{mockTicket.priority}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Organization</p>
                <Link href={`/superadmin/organizations/${mockTicket.organizationId}`} className="text-primary hover:underline">
                  {mockTicket.organization}
                </Link>
              </div>
              <Button variant="outline" className="w-full">Assign to Me</Button>
              <Button variant="outline" className="w-full text-green-600 border-green-200">Resolve Ticket</Button>
            </div>
          </Card>
        </div>
      </div>

      {showImpersonate && (
        <ImpersonationModal 
          organizationId={mockTicket.organizationId}
          organizationName={mockTicket.organization}
          onClose={() => setShowImpersonate(false)}
        />
      )}
    </div>
  )
}

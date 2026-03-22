'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Ticket {
  id: string
  title: string
  customer: string
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'closed' | 'on-hold'
  created: string
}

const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Login issues on mobile app',
    customer: 'Acme Corp',
    priority: 'high',
    status: 'in-progress',
    created: '2 hours ago',
  },
  {
    id: 'TKT-002',
    title: 'Feature request: Export to PDF',
    customer: 'Tech Startup',
    priority: 'low',
    status: 'open',
    created: '4 hours ago',
  },
  {
    id: 'TKT-003',
    title: 'Payment processing error',
    customer: 'Global Solutions',
    priority: 'high',
    status: 'on-hold',
    created: '1 day ago',
  },
  {
    id: 'TKT-004',
    title: 'Performance optimization needed',
    customer: 'Creative Agency',
    priority: 'medium',
    status: 'in-progress',
    created: '2 days ago',
  },
  {
    id: 'TKT-005',
    title: 'API documentation clarification',
    customer: 'Tech Startup',
    priority: 'low',
    status: 'closed',
    created: '3 days ago',
  },
]

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'on-hold': 'bg-gray-100 text-gray-800',
  closed: 'bg-green-100 text-green-800',
}

export default function SupportTickets() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted">
                <TableHead className="text-card-foreground">Ticket ID</TableHead>
                <TableHead className="text-card-foreground">Title</TableHead>
                <TableHead className="text-card-foreground">Customer</TableHead>
                <TableHead className="text-card-foreground">Priority</TableHead>
                <TableHead className="text-card-foreground">Status</TableHead>
                <TableHead className="text-card-foreground">Created</TableHead>
                <TableHead className="text-card-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-card-foreground">{ticket.id}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.title}</TableCell>
                  <TableCell className="text-card-foreground">{ticket.customer}</TableCell>
                  <TableCell>
                    <Badge className={priorityColors[ticket.priority]}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[ticket.status]}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <MessageSquare size={16} className="mr-2" />
                          <span>Reply</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Change Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

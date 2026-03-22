'use client'

import Link from 'next/link'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const mockTickets = [
  {
    id: '#2847',
    subject: 'Cannot access billing reports',
    organization: 'Green Valley Coop',
    priority: 'high',
    status: 'open',
    assignee: 'John Support',
    createdAt: '2024-03-15',
    responses: 3
  },
  {
    id: '#2846',
    subject: 'User account locked',
    organization: 'Urban Farmers Coop',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Sarah Agent',
    createdAt: '2024-03-14',
    responses: 2
  },
  {
    id: '#2845',
    subject: 'Export feature not working',
    organization: 'Mountain Ridge Coop',
    priority: 'medium',
    status: 'open',
    assignee: 'Unassigned',
    createdAt: '2024-03-14',
    responses: 1
  },
  {
    id: '#2844',
    subject: 'API integration issue',
    organization: 'Riverside Farm Coop',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'Mike Dev',
    createdAt: '2024-03-13',
    responses: 4
  },
  {
    id: '#2843',
    subject: 'Password reset email not received',
    organization: 'Valley Trees Coop',
    priority: 'low',
    status: 'resolved',
    assignee: 'John Support',
    createdAt: '2024-03-13',
    responses: 2
  },
]

export default function TicketsList({ filters }: { filters: any }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tickets/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting ticket:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Ticket ID</TableHead>
            <TableHead className="text-gray-700 font-semibold">Subject</TableHead>
            <TableHead className="text-gray-700 font-semibold">Organization</TableHead>
            <TableHead className="text-gray-700 font-semibold">Priority</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-gray-700 font-semibold">Assignee</TableHead>
            <TableHead className="text-gray-700 font-semibold">Created</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTickets.map((ticket) => (
            <TableRow key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-mono font-medium text-gray-900">{ticket.id}</TableCell>
              <TableCell className="font-medium text-gray-900">{ticket.subject}</TableCell>
              <TableCell className="text-gray-600">{ticket.organization}</TableCell>
              <TableCell>
                <Badge className={
                  ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={
                  ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                  ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }>
                  {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">{ticket.assignee}</TableCell>
              <TableCell className="text-gray-600 text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/support/tickets/${ticket.id}`} className="cursor-pointer flex items-center">
                        <Eye size={16} className="mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/support/tickets/${ticket.id}/edit`} className="cursor-pointer flex items-center">
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(ticket.id)}
                      className="cursor-pointer text-red-600"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>

    <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

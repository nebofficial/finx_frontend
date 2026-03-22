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

const mockAlerts = [
  {
    id: '1',
    title: 'Maintenance Alert',
    type: 'maintenance',
    status: 'active',
    targetOrgs: 'All',
    createdAt: '2024-03-15',
    expiresAt: '2024-03-16',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Subscription Renewal Reminder',
    type: 'billing',
    status: 'active',
    targetOrgs: '45 orgs',
    createdAt: '2024-03-14',
    expiresAt: '2024-03-20',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Trial Expiring Soon',
    type: 'trial',
    status: 'active',
    targetOrgs: '12 orgs',
    createdAt: '2024-03-13',
    expiresAt: '2024-03-25',
    priority: 'medium'
  },
]

export default function AlertsList() {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/alerts/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
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
            <TableHead className="text-gray-700 font-semibold">Title</TableHead>
            <TableHead className="text-gray-700 font-semibold">Type</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-gray-700 font-semibold">Priority</TableHead>
            <TableHead className="text-gray-700 font-semibold">Target Orgs</TableHead>
            <TableHead className="text-gray-700 font-semibold">Expires</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAlerts.map((alert) => (
            <TableRow key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{alert.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  alert.type === 'maintenance' ? 'text-blue-600' :
                  alert.type === 'billing' ? 'text-purple-600' :
                  'text-orange-600'
                }>
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </TableCell>
              <TableCell>
                <Badge className={
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">{alert.targetOrgs}</TableCell>
              <TableCell className="text-gray-600 text-sm">{new Date(alert.expiresAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/notifications/alerts/${alert.id}`} className="cursor-pointer flex items-center">
                        <Eye size={16} className="mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/notifications/alerts/${alert.id}/edit`} className="cursor-pointer flex items-center">
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(alert.id)}
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
          <AlertDialogTitle>Delete Alert</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this alert? This action cannot be undone.
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

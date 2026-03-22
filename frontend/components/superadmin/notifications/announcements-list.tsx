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

const mockAnnouncements = [
  {
    id: '1',
    title: 'System Maintenance Scheduled',
    description: 'We will be performing system maintenance on Saturday',
    status: 'published',
    channels: ['Email', 'In-app'],
    deliveryCount: 128,
    createdAt: '2024-03-15',
    createdBy: 'Admin User'
  },
  {
    id: '2',
    title: 'New Features Released',
    description: 'Check out our latest features and improvements',
    status: 'published',
    channels: ['Email', 'SMS', 'In-app'],
    deliveryCount: 128,
    createdAt: '2024-03-14',
    createdBy: 'Admin User'
  },
  {
    id: '3',
    title: 'End of Year Pricing Changes',
    description: 'Information about upcoming pricing adjustments',
    status: 'draft',
    channels: ['Email'],
    deliveryCount: 0,
    createdAt: '2024-03-13',
    createdBy: 'Admin User'
  },
]

export default function AnnouncementsList() {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/announcements/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
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
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-gray-700 font-semibold">Channels</TableHead>
            <TableHead className="text-gray-700 font-semibold">Delivered</TableHead>
            <TableHead className="text-gray-700 font-semibold">Created</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAnnouncements.map((announcement) => (
            <TableRow key={announcement.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{announcement.title}</TableCell>
              <TableCell>
                <Badge className={announcement.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {announcement.channels.map(ch => (
                    <Badge key={ch} variant="outline" className="text-xs">{ch}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{announcement.deliveryCount}</TableCell>
              <TableCell className="text-gray-600 text-sm">{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/notifications/announcements/${announcement.id}`} className="cursor-pointer flex items-center">
                        <Eye size={16} className="mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/notifications/announcements/${announcement.id}/edit`} className="cursor-pointer flex items-center">
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(announcement.id)}
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
          <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this announcement? This action cannot be undone.
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

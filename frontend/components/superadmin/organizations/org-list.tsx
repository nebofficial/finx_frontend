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
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const mockOrganizations = [
  {
    id: '1',
    name: 'Green Valley Coop',
    members: 245,
    plan: 'premium',
    status: 'active',
    admin: 'John Smith',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Urban Farmers Coop',
    members: 156,
    plan: 'trial',
    status: 'active',
    admin: 'Sarah Johnson',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Mountain Ridge Coop',
    members: 89,
    plan: 'starter',
    status: 'active',
    admin: 'Michael Brown',
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    name: 'Riverside Farm Coop',
    members: 412,
    plan: 'enterprise',
    status: 'active',
    admin: 'Emily Davis',
    createdAt: '2023-12-05'
  },
  {
    id: '5',
    name: 'Sunset Valley Coop',
    members: 0,
    plan: 'starter',
    status: 'inactive',
    admin: 'Robert Wilson',
    createdAt: '2024-01-08'
  },
]

export default function OrgList({ filters }: { filters: any }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/organizations/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting organization:', error)
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
            <TableHead className="text-gray-700 font-semibold">Organization</TableHead>
            <TableHead className="text-gray-700 font-semibold">Admin</TableHead>
            <TableHead className="text-gray-700 font-semibold">Members</TableHead>
            <TableHead className="text-gray-700 font-semibold">Plan</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-gray-700 font-semibold">Joined</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOrganizations.map((org) => (
            <TableRow key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{org.name}</TableCell>
              <TableCell className="text-gray-600">{org.admin}</TableCell>
              <TableCell className="text-gray-600">{org.members}</TableCell>
              <TableCell>
                <Badge className={
                  org.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                  org.plan === 'starter' ? 'bg-blue-100 text-blue-800' :
                  org.plan === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600 text-sm">{new Date(org.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/organizations/${org.id}`} className="cursor-pointer flex items-center">
                        <Eye size={16} className="mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/superadmin/organizations/${org.id}/edit`} className="cursor-pointer flex items-center">
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(org.id)}
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
          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this organization? This action cannot be undone.
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

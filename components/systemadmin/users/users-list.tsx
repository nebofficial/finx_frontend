'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface User {
  id: string
  name: string
  email: string
  role: string
  tenant: string
  status: 'active' | 'inactive'
  lastLogin: string
}

const users: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@acme.com',
    role: 'Admin',
    tenant: 'Acme Corporation',
    status: 'active',
    lastLogin: '2 hours ago',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@acme.com',
    role: 'Manager',
    tenant: 'Acme Corporation',
    status: 'active',
    lastLogin: '30 minutes ago',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@techstartup.com',
    role: 'User',
    tenant: 'Tech Startup Inc',
    status: 'active',
    lastLogin: '1 day ago',
  },
  {
    id: '4',
    name: 'David Smith',
    email: 'david@globalsol.com',
    role: 'Manager',
    tenant: 'Global Solutions Ltd',
    status: 'inactive',
    lastLogin: '5 days ago',
  },
  {
    id: '5',
    name: 'Jessica Lee',
    email: 'jessica@creative.com',
    role: 'User',
    tenant: 'Creative Agency',
    status: 'active',
    lastLogin: '3 hours ago',
  },
]

const roleColors = {
  Admin: 'bg-red-100 text-red-800',
  Manager: 'bg-yellow-100 text-yellow-800',
  User: 'bg-blue-100 text-blue-800',
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function UsersList() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted">
                <TableHead className="text-card-foreground">User</TableHead>
                <TableHead className="text-card-foreground">Email</TableHead>
                <TableHead className="text-card-foreground">Role</TableHead>
                <TableHead className="text-card-foreground">Tenant</TableHead>
                <TableHead className="text-card-foreground">Status</TableHead>
                <TableHead className="text-card-foreground">Last Login</TableHead>
                <TableHead className="text-card-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-primary">
                        <AvatarFallback className="text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-card-foreground">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-card-foreground">{user.tenant}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye size={16} className="mr-2" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit size={16} className="mr-2" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 size={16} className="mr-2" />
                          <span>Delete</span>
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

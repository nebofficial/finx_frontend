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

interface Tenant {
  id: string
  name: string
  email: string
  users: number
  plan: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
}

const tenants: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'admin@acme.com',
    users: 45,
    plan: 'Enterprise',
    status: 'active',
    createdAt: 'Jan 15, 2024',
  },
  {
    id: '2',
    name: 'Tech Startup Inc',
    email: 'hello@techstartup.com',
    users: 12,
    plan: 'Professional',
    status: 'active',
    createdAt: 'Feb 20, 2024',
  },
  {
    id: '3',
    name: 'Global Solutions Ltd',
    email: 'contact@globalsol.com',
    users: 89,
    plan: 'Enterprise',
    status: 'active',
    createdAt: 'Mar 10, 2024',
  },
  {
    id: '4',
    name: 'Creative Agency',
    email: 'info@creative.com',
    users: 8,
    plan: 'Starter',
    status: 'active',
    createdAt: 'Apr 5, 2024',
  },
  {
    id: '5',
    name: 'Legacy Systems',
    email: 'support@legacy.com',
    users: 34,
    plan: 'Professional',
    status: 'inactive',
    createdAt: 'May 12, 2024',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
}

const planColors = {
  Starter: 'bg-blue-100 text-blue-800',
  Professional: 'bg-yellow-100 text-yellow-800',
  Enterprise: 'bg-green-100 text-green-800',
}

export default function TenantsList() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">All Tenants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted">
                <TableHead className="text-card-foreground">Tenant Name</TableHead>
                <TableHead className="text-card-foreground">Contact Email</TableHead>
                <TableHead className="text-card-foreground text-center">Users</TableHead>
                <TableHead className="text-card-foreground">Plan</TableHead>
                <TableHead className="text-card-foreground">Status</TableHead>
                <TableHead className="text-card-foreground">Created</TableHead>
                <TableHead className="text-card-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-card-foreground">
                    {tenant.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tenant.email}</TableCell>
                  <TableCell className="text-center text-card-foreground">{tenant.users}</TableCell>
                  <TableCell>
                    <Badge className={planColors[tenant.plan as keyof typeof planColors]}>
                      {tenant.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[tenant.status as keyof typeof statusColors]}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tenant.createdAt}</TableCell>
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
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit size={16} className="mr-2" />
                          <span>Edit Tenant</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-warning">
                          <span>Suspend</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-info">
                          <span>Impersonate</span>
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

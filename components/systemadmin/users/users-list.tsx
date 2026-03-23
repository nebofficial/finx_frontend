'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Eye, Loader2 } from 'lucide-react'
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
import { platformUserApi } from '@/services/api/platformUserApi'
import { toast } from 'sonner'

type PlatformUserRow = {
  id: string
  name: string
  email: string
  role: string
  is_active?: boolean
  last_login_at?: string | null
}

const roleColors: Record<string, string> = {
  SystemAdmin: 'bg-red-100 text-red-800',
  Support: 'bg-blue-100 text-blue-800',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UsersList() {
  const [users, setUsers] = useState<PlatformUserRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await platformUserApi.list({ limit: 200 })
      const list = res.data?.data?.users ?? []
      setUsers(Array.isArray(list) ? list : [])
    } catch {
      toast.error('Failed to load platform users.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Platform users</CardTitle>
        <p className="text-sm text-muted-foreground">
          SystemAdmin and Support accounts for the FinX control plane (main database).
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading…
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted">
                  <TableHead className="text-card-foreground">User</TableHead>
                  <TableHead className="text-card-foreground">Email</TableHead>
                  <TableHead className="text-card-foreground">Role</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                  <TableHead className="text-card-foreground">Last login</TableHead>
                  <TableHead className="text-card-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const last =
                    user.last_login_at &&
                    formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true })
                  return (
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
                        <Badge className={roleColors[user.role] || 'bg-muted text-muted-foreground'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.is_active === false
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {user.is_active === false ? 'inactive' : 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{last || '—'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="User actions">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/systemadmin/users/${user.id}/edit`} className="flex items-center">
                                <Edit size={16} className="mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" disabled>
                              <Eye size={16} className="mr-2" />
                              <span>View (use Edit)</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

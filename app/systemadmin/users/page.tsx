import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UsersList from '@/components/systemadmin/users/users-list'
import UserFilters from '@/components/systemadmin/users/user-filters'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">Manage system users and their permissions</p>
      </div>

      <div className="flex justify-between items-center">
        <UserFilters />
        <Link href="/systemadmin/users/add">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus size={20} />
            Add User
          </Button>
        </Link>
      </div>

      <UsersList />
    </div>
  )
}

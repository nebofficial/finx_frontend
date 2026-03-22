'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft } from 'lucide-react'

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
          <p className="text-muted-foreground text-sm mt-1">Update user information and permissions</p>
        </div>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter user name"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Role</FieldLabel>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Status</FieldLabel>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-6">
            <Link href="/admin/users">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

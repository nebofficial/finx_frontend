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
import { toast } from 'sonner'
import { platformUserApi } from '@/services/api/platformUserApi'

export default function AddUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Support' as 'SystemAdmin' | 'Support',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as 'SystemAdmin' | 'Support' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await platformUserApi.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })
      toast.success('User created')
      router.push('/systemadmin/users')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message)
          : 'Failed to create user'
      toast.error(msg || 'Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/systemadmin/users">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add platform user</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a SystemAdmin or Support account</p>
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
              placeholder="Full name"
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
              placeholder="Email"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Role</FieldLabel>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="SystemAdmin">SystemAdmin</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-6">
            <Link href="/systemadmin/users">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? 'Creating...' : 'Create user'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

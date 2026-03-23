'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import { Switch } from '@/components/ui/switch'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { platformUserApi } from '@/services/api/platformUserApi'

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : ''

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Support' as 'SystemAdmin' | 'Support',
    is_active: true,
    password: '',
  })

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await platformUserApi.get(id)
      const user = res.data?.data?.user
      if (!user) {
        toast.error('User not found')
        router.replace('/systemadmin/users')
        return
      }
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role === 'SystemAdmin' ? 'SystemAdmin' : 'Support',
        is_active: user.is_active !== false,
        password: '',
      })
    } catch {
      toast.error('Failed to load user')
      router.replace('/systemadmin/users')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    void load()
  }, [load])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as 'SystemAdmin' | 'Support' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        is_active: formData.is_active,
      }
      if (formData.password.trim().length >= 8) {
        payload.password = formData.password
      }
      await platformUserApi.update(id, payload)
      toast.success('User updated')
      router.push('/systemadmin/users')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message)
          : 'Failed to update user'
      toast.error(msg || 'Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading user…
      </div>
    )
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
          <h1 className="text-3xl font-bold text-foreground">Edit platform user</h1>
          <p className="text-muted-foreground text-sm mt-1">Update account details or reset password</p>
        </div>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>New password (optional)</FieldLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
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

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Inactive users cannot sign in.</p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(v) => setFormData((p) => ({ ...p, is_active: v }))}
            />
          </div>

          <div className="flex gap-3 justify-end pt-6">
            <Link href="/systemadmin/users">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90">
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

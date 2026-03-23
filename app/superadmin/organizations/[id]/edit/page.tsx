'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { superAdminApi } from '@/services/api/superAdminApi'
import { toast } from 'sonner'

export default function EditOrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params?.id === 'string' ? params.id : ''

  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    logo_url: '',
  })

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const orgRes = await superAdminApi.getOrganization()
      const org = orgRes.data?.data?.organization as {
        id: string
        name: string
        email: string
        phone?: string | null
        address?: string | null
        logo_url?: string | null
      }
      if (!org || org.id !== id) {
        toast.error('Organization not found.')
        router.replace('/superadmin/organizations')
        return
      }
      setFormData({
        name: org.name || '',
        email: org.email || '',
        phone: org.phone || '',
        address: org.address || '',
        logo_url: org.logo_url || '',
      })
    } catch {
      toast.error('Failed to load organization.')
      router.replace('/superadmin/organizations')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    void load()
  }, [load])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await superAdminApi.updateOrganization({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        logo_url: formData.logo_url.trim() || null,
      })
      toast.success('Organization updated')
      router.push(`/superadmin/organizations/${id}`)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message)
          : 'Update failed'
      toast.error(msg || 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/superadmin/organizations/${id}`}>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit cooperative</h1>
          <p className="text-gray-600 text-sm mt-1">Updates your tenant profile (API: PUT /super-admin/organization)</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Name *</FieldLabel>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </Field>
              <Field>
                <FieldLabel>Email *</FieldLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Textarea name="address" value={formData.address} onChange={handleChange} rows={3} />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Logo URL</FieldLabel>
              <Input name="logo_url" value={formData.logo_url} onChange={handleChange} placeholder="https://…" />
            </Field>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href={`/superadmin/organizations/${id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

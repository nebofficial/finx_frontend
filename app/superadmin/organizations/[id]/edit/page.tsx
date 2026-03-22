'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'
import { ChevronLeft } from 'lucide-react'

export default function EditOrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Green Valley Coop',
    email: 'admin@greenvally.coop',
    phone: '+1-555-0100',
    website: 'https://greenvallycoop.com',
    address: '123 Main St, Springfield, IL 62701',
    description: 'A thriving agricultural cooperative serving the region',
    plan: 'premium',
    adminEmail: 'admin@greenvallycoop.coop',
    status: 'active',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlanChange = (value: string) => {
    setFormData(prev => ({ ...prev, plan: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/superadmin/organizations/${id}`)
      }
    } catch (error) {
      console.error('Error updating organization:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/superadmin/organizations/${id}`}>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Organization</h1>
          <p className="text-gray-600 text-sm mt-1">Update organization details and settings</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Organization Name *</FieldLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Email *</FieldLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel>Website</FieldLabel>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Subscription Plan *</FieldLabel>
                <Select value={formData.plan} onValueChange={handlePlanChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial (14 days)</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Status *</FieldLabel>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Admin Email *</FieldLabel>
                <Input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href={`/superadmin/organizations/${id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Organization'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

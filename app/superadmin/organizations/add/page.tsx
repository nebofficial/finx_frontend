'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'
import { ChevronLeft } from 'lucide-react'

export default function AddOrganizationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    plan: 'starter',
    adminEmail: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlanChange = (value: string) => {
    setFormData(prev => ({ ...prev, plan: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API call to create organization
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/superadmin/organizations')
      }
    } catch (error) {
      console.error('Error creating organization:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/superadmin/organizations">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Organization</h1>
          <p className="text-gray-600 text-sm mt-1">Create a new cooperative organization</p>
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
                  placeholder="e.g., Green Valley Coop"
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
                  placeholder="admin@example.coop"
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
                  placeholder="+1-555-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel>Website</FieldLabel>
                <Input
                  name="website"
                  placeholder="https://example.coop"
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
                placeholder="Street, City, State, ZIP"
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
                placeholder="Organization description..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FieldLabel>Admin Email *</FieldLabel>
                <Input
                  type="email"
                  name="adminEmail"
                  placeholder="admin@example.coop"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href="/superadmin/organizations">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

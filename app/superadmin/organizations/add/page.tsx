'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  const [passwordError, setPasswordError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    plan: 'starter',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    adminConfirmPassword: '',
    sendWelcomeEmail: true,
    requirePasswordReset: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlanChange = (value: string) => {
    setFormData(prev => ({ ...prev, plan: value }))
  }

  const handleCheckChange = (field: 'sendWelcomeEmail' | 'requirePasswordReset', checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (formData.adminPassword !== formData.adminConfirmPassword) {
      setPasswordError('Admin password and confirm password do not match.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            address: formData.address,
            description: formData.description,
            plan: formData.plan,
          },
          admin: {
            firstName: formData.adminFirstName,
            lastName: formData.adminLastName,
            email: formData.adminEmail,
            phone: formData.adminPhone,
            password: formData.adminPassword,
            sendWelcomeEmail: formData.sendWelcomeEmail,
            requirePasswordReset: formData.requirePasswordReset,
          },
        }),
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
      <div className="flex items-center gap-4">
        <Link href="/superadmin/organizations">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Onboarding</h1>
          <p className="text-gray-600 text-sm mt-1">Create a cooperative organization and organization admin account</p>
        </div>
      </div>

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
            </div>
          </FieldGroup>

          <FieldGroup>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Organization Admin Account</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Admin First Name *</FieldLabel>
                <Input
                  name="adminFirstName"
                  placeholder="e.g., John"
                  value={formData.adminFirstName}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Admin Last Name *</FieldLabel>
                <Input
                  name="adminLastName"
                  placeholder="e.g., Doe"
                  value={formData.adminLastName}
                  onChange={handleChange}
                  required
                />
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
              <Field>
                <FieldLabel>Admin Phone</FieldLabel>
                <Input
                  type="tel"
                  name="adminPhone"
                  placeholder="+1-555-0011"
                  value={formData.adminPhone}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel>Temporary Password *</FieldLabel>
                <Input
                  type="password"
                  name="adminPassword"
                  placeholder="Enter temporary password"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Confirm Password *</FieldLabel>
                <Input
                  type="password"
                  name="adminConfirmPassword"
                  placeholder="Confirm temporary password"
                  value={formData.adminConfirmPassword}
                  onChange={handleChange}
                  required
             />
              </Field>
            </div>

            {passwordError && (
              <p className="text-sm text-red-600 mt-2">{passwordError}</p>
            )}

            <div className="space-y-3 mt-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendWelcomeEmail"
                  checked={formData.sendWelcomeEmail}
                  onCheckedChange={(checked) => handleCheckChange('sendWelcomeEmail', checked === true)}
                />
                <Label htmlFor="sendWelcomeEmail" className="text-sm text-gray-700">
                  Send welcome email with login instructions
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="requirePasswordReset"
                  checked={formData.requirePasswordReset}
                  onCheckedChange={(checked) => handleCheckChange('requirePasswordReset', checked === true)}
                />
                <Label htmlFor="requirePasswordReset" className="text-sm text-gray-700">
                  Require password reset on first login
                </Label>
              </div>
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

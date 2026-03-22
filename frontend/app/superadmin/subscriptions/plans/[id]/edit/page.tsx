'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'
import { ChevronLeft } from 'lucide-react'

export default function EditPlanPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState({
    userManagement: true,
    apiAccess: true,
    customReports: true,
    prioritySupport: true,
    sso: false,
  })

  const [formData, setFormData] = useState({
    name: 'Professional',
    description: 'Perfect for growing organizations with advanced needs',
    price: '199.99',
    billingCycle: 'monthly',
    maxUsers: '50',
    storageGB: '500',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (feature: string) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof features]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: Object.keys(features).filter(f => features[f as keyof typeof features])
        }),
      })

      if (response.ok) {
        router.push('/superadmin/subscriptions')
      }
    } catch (error) {
      console.error('Error updating plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/subscriptions">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Plan</h1>
          <p className="text-gray-600 text-sm mt-1">Update plan details and features</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Plan Name *</FieldLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Monthly Price ($) *</FieldLabel>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Max Users</FieldLabel>
                <Input
                  type="number"
                  name="maxUsers"
                  value={formData.maxUsers}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel>Storage (GB)</FieldLabel>
                <Input
                  type="number"
                  name="storageGB"
                  value={formData.storageGB}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Features Included</Label>
            <div className="space-y-3">
              {[
                { key: 'userManagement', label: 'User Management' },
                { key: 'apiAccess', label: 'API Access' },
                { key: 'customReports', label: 'Custom Reports' },
                { key: 'prioritySupport', label: 'Priority Support' },
                { key: 'sso', label: 'Single Sign-On (SSO)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={features[key as keyof typeof features]}
                    onCheckedChange={() => handleFeatureChange(key)}
                  />
                  <Label htmlFor={key} className="font-normal cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href="/superadmin/subscriptions">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Plan'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

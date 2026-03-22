'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'

interface OrgFormProps {
  onSuccess?: () => void
}

export default function OrgForm({ onSuccess }: OrgFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onSuccess?.()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Organization Name *</FieldLabel>
            <Input placeholder="e.g., Green Valley Coop" required />
          </Field>
          <Field>
            <FieldLabel>Email *</FieldLabel>
            <Input type="email" placeholder="admin@example.coop" required />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input type="tel" placeholder="+1-555-0000" />
          </Field>
          <Field>
            <FieldLabel>Website</FieldLabel>
            <Input placeholder="https://example.coop" />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Textarea placeholder="Street, City, State, ZIP" rows={2} />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea placeholder="Organization description..." rows={3} />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Subscription Plan *</FieldLabel>
            <Select defaultValue="starter">
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
            <FieldLabel>Admin User *</FieldLabel>
            <Input placeholder="admin@example.coop" required />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Organization'}
        </Button>
      </div>
    </form>
  )
}

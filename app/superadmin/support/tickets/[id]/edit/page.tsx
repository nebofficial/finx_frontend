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

export default function EditTicketPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: 'Cannot access billing reports',
    organization: 'Green Valley Coop',
    priority: 'high',
    category: 'technical',
    description: 'We are unable to access the billing reports section. The page loads but shows an error when we try to filter by date range.',
    assignee: 'John Support',
    status: 'open',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/superadmin/support/tickets/${id}`)
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/superadmin/support/tickets/${id}`}>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Support Ticket</h1>
          <p className="text-gray-600 text-sm mt-1">Update ticket details and assignment</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Subject *</FieldLabel>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Organization *</FieldLabel>
                <Input
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Assign To</FieldLabel>
                <Input
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Priority *</FieldLabel>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Category *</FieldLabel>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Status *</FieldLabel>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Description *</FieldLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </Field>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href={`/superadmin/support/tickets/${id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Ticket'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

export default function AddTicketPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    organization: '',
    priority: 'medium',
    category: 'technical',
    description: '',
    assignee: '',
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
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/superadmin/support/tickets')
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/support/tickets">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="text-gray-600 text-sm mt-1">Create a new support ticket</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Subject *</FieldLabel>
              <Input
                name="subject"
                placeholder="Brief description of the issue"
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
                  placeholder="Select or type organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Assign To</FieldLabel>
                <Input
                  name="assignee"
                  placeholder="Support staff member"
                  value={formData.assignee}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Description *</FieldLabel>
              <Textarea
                name="description"
                placeholder="Detailed description of the issue..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </Field>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href="/superadmin/support/tickets">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

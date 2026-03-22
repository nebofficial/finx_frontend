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

export default function EditAlertPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: 'Database Maintenance Scheduled',
    type: 'maintenance',
    message: 'We will be performing scheduled database maintenance on Saturday. The system may experience brief interruptions.',
    severity: 'warning',
    scheduledTime: '2024-03-23T02:00',
    duration: '2',
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
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/superadmin/notifications/alerts')
      }
    } catch (error) {
      console.error('Error updating alert:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/notifications/alerts">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Alert</h1>
          <p className="text-gray-600 text-sm mt-1">Update alert details</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Alert Type *</FieldLabel>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Severity *</FieldLabel>
                <Select value={formData.severity} onValueChange={(value) => handleSelectChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Message *</FieldLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Scheduled Time</FieldLabel>
                <Input
                  type="datetime-local"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel>Duration (hours)</FieldLabel>
                <Input
                  type="number"
                  name="duration"
                  min="1"
                  max="24"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href="/superadmin/notifications/alerts">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Alert'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

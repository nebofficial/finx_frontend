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

export default function AddAnnouncementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    inApp: true,
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    priority: 'normal',
    status: 'draft',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleChannelChange = (channel: string) => {
    setChannels(prev => ({
      ...prev,
      [channel]: !prev[channel as keyof typeof channels]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          channels: Object.keys(channels).filter(k => channels[k as keyof typeof channels])
        }),
      })

      if (response.ok) {
        router.push('/superadmin/notifications/announcements')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/superadmin/notifications/announcements">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Announcement</h1>
          <p className="text-gray-600 text-sm mt-1">Send a system-wide announcement to all cooperatives</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <Input
                name="title"
                placeholder="e.g., System Maintenance Scheduled"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Description *</FieldLabel>
              <Input
                name="description"
                placeholder="Brief summary of the announcement"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Content *</FieldLabel>
              <Textarea
                name="content"
                placeholder="Full announcement content..."
                value={formData.content}
                onChange={handleChange}
                rows={5}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Priority</FieldLabel>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Delivery Channels</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="email"
                  checked={channels.email}
                  onCheckedChange={() => handleChannelChange('email')}
                />
                <Label htmlFor="email" className="font-normal cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sms"
                  checked={channels.sms}
                  onCheckedChange={() => handleChannelChange('sms')}
                />
                <Label htmlFor="sms" className="font-normal cursor-pointer">SMS</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="inApp"
                  checked={channels.inApp}
                  onCheckedChange={() => handleChannelChange('inApp')}
                />
                <Label htmlFor="inApp" className="font-normal cursor-pointer">In-app</Label>
              </div>
            </div>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link href="/superadmin/notifications/announcements">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Announcement'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

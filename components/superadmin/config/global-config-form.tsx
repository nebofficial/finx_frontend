'use client'

import { useState } from 'react'
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
import { FieldGroup, FieldLabel, Field, FieldSet, FieldLegend } from '@/components/ui/field'
import { Label } from '@/components/ui/label'

export default function GlobalConfigForm() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Global System Settings</h2>
      
      <form className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>System Name *</FieldLabel>
              <Input placeholder="CoopHub" defaultValue="CoopHub" required />
            </Field>
            <Field>
              <FieldLabel>Support Email *</FieldLabel>
              <Input type="email" placeholder="support@coophub.local" defaultValue="support@coophub.local" required />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Support Phone</FieldLabel>
            <Input placeholder="+1-555-0000" />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Base URL *</FieldLabel>
            <Input placeholder="https://app.coophub.local" defaultValue="https://app.coophub.local" required />
          </Field>
        </FieldGroup>

        <FieldSet>
          <FieldLegend>Trial Configuration</FieldLegend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Default Trial Duration (days)</FieldLabel>
              <Input type="number" placeholder="14" defaultValue="14" />
            </Field>
            <Field>
              <FieldLabel>Max Active Trials</FieldLabel>
              <Input type="number" placeholder="50" defaultValue="50" />
            </Field>
          </div>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Session & Security</FieldLegend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Session Timeout (minutes)</FieldLabel>
              <Input type="number" placeholder="60" defaultValue="60" />
            </Field>
            <Field>
              <FieldLabel>Max Login Attempts</FieldLabel>
              <Input type="number" placeholder="5" defaultValue="5" />
            </Field>
          </div>
          <Field className="mt-4">
            <Label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="font-medium text-gray-900">Require Email Verification</span>
            </Label>
          </Field>
          <Field>
            <Label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="font-medium text-gray-900">Enable Two-Factor Authentication</span>
            </Label>
          </Field>
        </FieldSet>

        <FieldGroup>
          <Field>
            <FieldLabel>Privacy Policy URL</FieldLabel>
            <Input placeholder="https://coophub.local/privacy" />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Terms of Service URL</FieldLabel>
            <Input placeholder="https://coophub.local/terms" />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>System Announcement</FieldLabel>
            <Textarea placeholder="Add a system-wide announcement (optional)" rows={3} />
          </Field>
        </FieldGroup>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline">Reset to Defaults</Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { useState } from 'react'
import { Save, AlertCircle, Check } from 'lucide-react'

export default function GlobalSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'admin@saas.com',
    smsProvider: 'twilio',
    smsApiKey: '••••••••••••',
    apiRateLimit: '1000',
    sessionTimeout: '30',
    maxTenantsPerUser: '5',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sections = [
    {
      title: 'Email Configuration',
      description: 'Configure SMTP settings for system emails',
      fields: [
        { label: 'SMTP Host', key: 'smtpHost' },
        { label: 'SMTP Port', key: 'smtpPort' },
        { label: 'SMTP User', key: 'smtpUser' },
      ]
    },
    {
      title: 'SMS Configuration',
      description: 'Configure SMS provider for notifications',
      fields: [
        { label: 'SMS Provider', key: 'smsProvider', type: 'select', options: ['twilio', 'aws-sns', 'vonage'] },
        { label: 'API Key', key: 'smsApiKey', type: 'password' },
      ]
    },
    {
      title: 'API & Rate Limiting',
      description: 'Configure API rate limits and throttling',
      fields: [
        { label: 'Rate Limit (req/min)', key: 'apiRateLimit' },
      ]
    },
    {
      title: 'Session & Security',
      description: 'Configure session and security settings',
      fields: [
        { label: 'Session Timeout (minutes)', key: 'sessionTimeout' },
        { label: 'Max Tenants per User', key: 'maxTenantsPerUser' },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Global Settings</h1>
        <p className="text-muted-foreground mt-2">Configure system-wide settings and integrations</p>
      </div>

      {saved && (
        <div className="bg-success/10 border border-success rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-success" />
          <span className="text-sm text-card-foreground">Settings saved successfully</span>
        </div>
      )}

      {sections.map((section) => (
        <Card key={section.title} className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">{section.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{section.description}</p>

          <FieldGroup className="space-y-4">
            {section.fields.map((field) => (
              <Field key={field.key}>
                <FieldLabel>{field.label}</FieldLabel>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2 border border-input-border rounded-lg bg-white text-card-foreground"
                  >
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type || 'text'}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="bg-white border-input-border"
                  />
                )}
              </Field>
            ))}
          </FieldGroup>
        </Card>
      ))}

      <Card className="p-6 bg-yellow-50 border border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Important Notice</h3>
            <p className="text-sm text-yellow-800">
              Changes to these global settings will affect all tenants. Please ensure you have appropriate backups before making changes to database or storage configurations.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary-light text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

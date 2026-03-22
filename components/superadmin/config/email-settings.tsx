'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function EmailSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const handleTest = () => {
    setTestStatus('testing')
    setTimeout(() => {
      setTestStatus('success')
      setTimeout(() => {
        setTestStatus('idle')
      }, 2000)
    }, 1500)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Email Configuration (SMTP)</h2>
      
      <form className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>SMTP Server *</FieldLabel>
              <Input placeholder="smtp.gmail.com" defaultValue="smtp.gmail.com" required />
            </Field>
            <Field>
              <FieldLabel>Port *</FieldLabel>
              <Input placeholder="587" defaultValue="587" required />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Encryption *</FieldLabel>
              <Input placeholder="TLS" defaultValue="TLS" required />
            </Field>
            <Field>
              <FieldLabel>From Email *</FieldLabel>
              <Input type="email" placeholder="noreply@system.local" defaultValue="noreply@system.local" required />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Username/Email *</FieldLabel>
            <Input placeholder="your-email@gmail.com" required />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Password/App Password *</FieldLabel>
            <Input type="password" placeholder="••••••••" required />
          </Field>
        </FieldGroup>

        {testStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Email Configuration Valid</p>
              <p className="text-sm text-green-800">Test email sent successfully to noreply@system.local</p>
            </div>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Connection Failed</p>
              <p className="text-sm text-red-800">Unable to connect to SMTP server. Please check your settings.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleTest}
            disabled={testStatus === 'testing'}
          >
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

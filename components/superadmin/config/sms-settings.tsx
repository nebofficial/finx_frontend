'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'

export default function SmsSettings() {
  const [provider, setProvider] = useState('twilio')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">SMS Gateway Configuration</h2>
      
      <form className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel>SMS Provider *</FieldLabel>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="vonage">Vonage (Nexmo)</SelectItem>
                <SelectItem value="aws-sns">AWS SNS</SelectItem>
                <SelectItem value="messagebird">MessageBird</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        {provider === 'twilio' && (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel>Account SID *</FieldLabel>
                <Input placeholder="Your Twilio Account SID" required />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Auth Token *</FieldLabel>
                <Input type="password" placeholder="Your Auth Token" required />
              </Field>
            </FieldGroup>
          </>
        )}

        {provider === 'vonage' && (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel>API Key *</FieldLabel>
                <Input placeholder="Your Vonage API Key" required />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>API Secret *</FieldLabel>
                <Input type="password" placeholder="Your API Secret" required />
              </Field>
            </FieldGroup>
          </>
        )}

        <FieldGroup>
          <Field>
            <FieldLabel>From Number *</FieldLabel>
            <Input placeholder="+1-555-0000 or shortcode" required />
          </Field>
        </FieldGroup>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline">Test Connection</Button>
          <Button 
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

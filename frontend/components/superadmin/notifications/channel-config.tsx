'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup, FieldLabel, Field } from '@/components/ui/field'
import { Mail, MessageSquare, Bell } from 'lucide-react'

export default function ChannelConfig() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail size={16} />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare size={16} />
            SMS
          </TabsTrigger>
          <TabsTrigger value="inapp" className="flex items-center gap-2">
            <Bell size={16} />
            In-App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Email Configuration</h2>
            <form className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>SMTP Server</FieldLabel>
                  <Input placeholder="smtp.gmail.com" defaultValue="smtp.gmail.com" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Port</FieldLabel>
                    <Input placeholder="587" defaultValue="587" />
                  </Field>
                  <Field>
                    <FieldLabel>Encryption</FieldLabel>
                    <Input placeholder="TLS" defaultValue="TLS" />
                  </Field>
                </div>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>From Email</FieldLabel>
                  <Input type="email" placeholder="noreply@coophub.local" defaultValue="noreply@coophub.local" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <Input placeholder="your-email@gmail.com" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input type="password" placeholder="••••••••" />
                </Field>
              </FieldGroup>
              <div className="pt-4 border-t flex gap-3 justify-end">
                <Button variant="outline">Test Connection</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Email Config'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">SMS Configuration</h2>
            <form className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>SMS Provider</FieldLabel>
                  <Input placeholder="e.g., Twilio" defaultValue="Twilio" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Account SID</FieldLabel>
                  <Input placeholder="Your Account SID" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Auth Token</FieldLabel>
                  <Input type="password" placeholder="Your Auth Token" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>From Number</FieldLabel>
                  <Input placeholder="+1-555-0000" />
                </Field>
              </FieldGroup>
              <div className="pt-4 border-t flex gap-3 justify-end">
                <Button variant="outline">Test Connection</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save SMS Config'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="inapp">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">In-App Notifications</h2>
            <form className="space-y-4">
              <FieldGroup>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="font-medium text-gray-900">Enable In-App Notifications</span>
                </Label>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Notification Display Duration (seconds)</FieldLabel>
                  <Input type="number" placeholder="5" defaultValue="5" />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Max Notifications to Show</FieldLabel>
                  <Input type="number" placeholder="5" defaultValue="5" />
                </Field>
              </FieldGroup>
              <div className="pt-4 border-t flex gap-3 justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save In-App Config'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

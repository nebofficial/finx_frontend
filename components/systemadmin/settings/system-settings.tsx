'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function SystemSettings() {
  const [siteName, setSiteName] = useState('SaaS Admin Platform')
  const [timezone, setTimezone] = useState('UTC')
  const [theme, setTheme] = useState('light')

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">System Settings</CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure general system settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-card-foreground">Site Name</Label>
          <Input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="bg-background text-foreground border-input placeholder-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-card-foreground">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="bg-background text-foreground border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">EST</SelectItem>
                <SelectItem value="CST">CST</SelectItem>
                <SelectItem value="PST">PST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="bg-background text-foreground border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-green-700 text-primary-foreground">
            Save Changes
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

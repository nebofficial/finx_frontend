'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Copy, Eye, EyeOff, Trash2, Plus, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function APIKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  // TODO: Fetch API keys from backend API
  // API keys should NEVER be hardcoded in frontend code
  const apiKeys: Array<{
    id: string
    name: string
    key: string
    type: 'Live' | 'Test'
    created: string
    lastUsed: string
    requests: string
  }> = []

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">API Keys</h1>
          <p className="text-muted-foreground mt-2">Manage API keys for platform integration</p>
        </div>
        <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {/* New Key Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Generate API Key</h2>
        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Key Name</FieldLabel>
              <Input placeholder="e.g., Production API Key" className="bg-white border-input-border" />
            </Field>
            <Field>
              <FieldLabel>Key Type</FieldLabel>
              <select className="w-full px-4 py-2 border border-input-border rounded-lg bg-white text-card-foreground">
                <option>Live</option>
                <option>Test</option>
              </select>
            </Field>
            <Field>
              <FieldLabel>Allowed Domains</FieldLabel>
              <Input placeholder="example.com, api.example.com" className="bg-white border-input-border" />
            </Field>
          </FieldGroup>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
            Generate Key
          </Button>
        </div>
      </Card>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <Card key={key.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{key.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Created on {key.created}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${key.type === 'Live' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {key.type}
              </span>
            </div>

            <div className="bg-gray-50 border border-border-light rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-sm text-card-foreground font-mono">
                  {showKey === key.id ? key.key : key.key.substring(0, 20) + '...'}
                </code>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-card-foreground bg-white hover:bg-muted border border-border-light"
                    onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                  >
                    {showKey === key.id ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className={`h-8 border border-border-light ${copied === key.id ? 'bg-success/10 text-success' : 'text-card-foreground bg-white hover:bg-muted'}`}
                    onClick={() => copyToClipboard(key.key, key.id)}
                  >
                    {copied === key.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Used</p>
                <p className="text-sm font-medium text-card-foreground">{key.lastUsed}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Requests</p>
                <p className="text-sm font-medium text-card-foreground">{key.requests}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Key ID</p>
                <p className="text-sm font-medium text-card-foreground">{key.id}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button className="text-destructive border border-border-light bg-white hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* API Documentation */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">API Documentation</h2>
        <div className="space-y-3">
          <p className="text-sm text-card-foreground">
            View our comprehensive API documentation and code examples:
          </p>
          <div className="flex gap-2">
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              View Docs
            </Button>
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              API Reference
            </Button>
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              SDKs & Libraries
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

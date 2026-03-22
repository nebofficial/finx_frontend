'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed: string
  created: string
}

const apiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_51234567890abcdef',
    lastUsed: '2 hours ago',
    created: 'Jan 15, 2024',
  },
  {
    id: '2',
    name: 'Testing Key',
    key: 'sk_test_09876543210fedcba',
    lastUsed: '30 minutes ago',
    created: 'Feb 20, 2024',
  },
]

export default function ApiKeys() {
  const [visibleKeys, setVisibleKeys] = useState<string[]>([])

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    )
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">API Keys</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage API keys for integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="p-4 border border-border rounded-lg space-y-3 hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-card-foreground">{apiKey.name}</h3>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>

            <div className="flex items-center gap-2 bg-background p-2 rounded font-mono text-sm text-muted-foreground">
              {visibleKeys.includes(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
              <button
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="ml-auto p-1 hover:bg-muted rounded"
              >
                {visibleKeys.includes(apiKey.id) ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Created: {apiKey.created} • Last used: {apiKey.lastUsed}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey.key)
                  }}
                >
                  <Copy size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button className="w-full bg-primary hover:bg-green-700 text-primary-foreground">
          Generate New Key
        </Button>
      </CardContent>
    </Card>
  )
}

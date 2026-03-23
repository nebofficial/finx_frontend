'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { platformApi } from '@/services/api/platformApi'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [smtpOk, setSmtpOk] = useState(false)
  const [dbOk, setDbOk] = useState(false)
  const [nodeEnv, setNodeEnv] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await platformApi.getStatus()
        const d = res.data?.data
        if (!mounted) return
        setSmtpOk(Boolean(d?.smtp_configured))
        setDbOk(Boolean(d?.database_ok))
        setNodeEnv(String(d?.node_env ?? ''))
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to load platform status'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Global settings</h1>
        <p className="text-muted-foreground mt-2">
          FinX reads configuration from environment variables on the API server. This page shows what the running backend
          reports — it does not write secrets from the browser.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">Email (SMTP)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Required for sending invoices and tenant welcome mail. Set <code className="text-xs bg-muted px-1 rounded">SMTP_HOST</code>,{' '}
            <code className="text-xs bg-muted px-1 rounded">SMTP_USER</code>, <code className="text-xs bg-muted px-1 rounded">SMTP_PASS</code>,{' '}
            <code className="text-xs bg-muted px-1 rounded">SMTP_FROM</code> in <code className="text-xs bg-muted px-1 rounded">backend/.env</code>.
          </p>
          <div className="flex items-center gap-2 text-sm">
            {smtpOk ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-800">SMTP appears configured</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-amber-900">SMTP not fully configured</span>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">Database</h2>
          <p className="text-sm text-muted-foreground mb-4">Main platform PostgreSQL connection used by this API instance.</p>
          <div className="flex items-center gap-2 text-sm">
            {dbOk ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-800">Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">Connection check failed</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">API environment: {nodeEnv || '—'}</p>
        </Card>
      </div>

      <Card className="p-6 bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Changing settings</h3>
            <p className="text-sm text-amber-900">
              Edit <code className="bg-white/80 px-1 rounded">backend/.env</code>, restart the Node process, then refresh this page. Rate limits and JWT
              expiry use <code className="bg-white/80 px-1 rounded">RATE_LIMIT_*</code> and <code className="bg-white/80 px-1 rounded">JWT_*</code> variables.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

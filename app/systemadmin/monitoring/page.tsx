'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FileText, Shield, Gauge } from 'lucide-react'

const links = [
  {
    href: '/systemadmin/monitoring/audit-logs',
    title: 'Audit logs',
    desc: 'Platform actions from the main database (filter, paginate).',
    icon: FileText,
  },
  {
    href: '/systemadmin/monitoring/security',
    title: 'Security signals',
    desc: 'Recent failed audit events and auth-related activity.',
    icon: Shield,
  },
  {
    href: '/systemadmin/monitoring/performance',
    title: 'Performance',
    desc: 'Node process memory, uptime, and host load from the API server.',
    icon: Gauge,
  },
]

export default function MonitoringHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Monitoring</h1>
        <p className="text-muted-foreground mt-2">Operational visibility for the FinX platform</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {links.map(({ href, title, desc, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="p-6 h-full hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Icon className="h-5 w-5 text-card-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-card-foreground">{title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

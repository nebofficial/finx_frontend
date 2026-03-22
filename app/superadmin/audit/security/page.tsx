'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SecurityAlerts from '@/components/superadmin/audit/security-alerts'
import { ChevronLeft } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/audit">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Monitoring</h1>
          <p className="text-gray-600 text-sm mt-1">Track suspicious activities and security events</p>
        </div>
      </div>

      <SecurityAlerts />
    </div>
  )
}

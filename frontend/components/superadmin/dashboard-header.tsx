'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Welcome back, SuperAdmin. Monitor your cooperatives and system health.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <ArrowUpRight size={16} className="mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  )
}

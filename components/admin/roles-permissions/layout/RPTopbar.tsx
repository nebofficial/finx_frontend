'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RefreshCcw } from 'lucide-react'

interface RPTopbarProps {
  search: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onRefresh: () => void
  loading?: boolean
}

export function RPTopbar({ search, onSearchChange, onSearchSubmit, onRefresh, loading }: RPTopbarProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Role & Permission Engine</h1>
        <p className="text-sm text-slate-400">Centralized access control across system, tenant, and branch scopes.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative min-w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles..."
            className="pl-9 bg-slate-950 border-slate-700 text-slate-100"
          />
        </div>
        <Button variant="secondary" onClick={onSearchSubmit} disabled={loading}>Search</Button>
        <Button variant="outline" onClick={onRefresh} disabled={loading} className="border-slate-700 text-slate-200">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}

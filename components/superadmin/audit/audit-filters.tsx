'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'

export type AuditFilterState = {
  source: string
  search: string
  dateRange: string
}

interface AuditFiltersProps {
  filters: AuditFilterState
  onFiltersChange: (filters: AuditFilterState) => void
}

export default function AuditFilters({ filters, onFiltersChange }: AuditFiltersProps) {
  return (
    <Card className="p-4 border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-card-foreground block mb-2">Source</label>
          <Select value={filters.source} onValueChange={(value) => onFiltersChange({ ...filters, source: value })}>
            <SelectTrigger className="border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="support_ticket">Support tickets</SelectItem>
              <SelectItem value="announcement">Notifications · announcement</SelectItem>
              <SelectItem value="maintenance">Notifications · maintenance</SelectItem>
              <SelectItem value="billing">Notifications · billing</SelectItem>
              <SelectItem value="loan_overdue">Notifications · loan overdue</SelectItem>
              <SelectItem value="system">Notifications · system</SelectItem>
              <SelectItem value="alert">Notifications · alert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground block mb-2">Search</label>
          <Input
            placeholder="Title, message, subject…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="border-border"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground block mb-2">Date range</label>
          <Select value={filters.dateRange} onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}>
            <SelectTrigger className="border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Activity is built from tenant notifications and support tickets (no separate audit table in this tenant API).
      </p>
    </Card>
  )
}

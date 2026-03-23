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

export type TicketFilterState = {
  search: string
  status: string
  priority: string
}

interface TicketFiltersProps {
  filters: TicketFilterState
  onFiltersChange: (filters: TicketFilterState) => void
}

export default function TicketFilters({ filters, onFiltersChange }: TicketFiltersProps) {
  return (
    <Card className="p-4 border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-card-foreground block mb-2">Search</label>
          <Input
            placeholder="Subject or ticket number…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="border-border"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground block mb-2">Status</label>
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
            <SelectTrigger className="border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground block mb-2">Priority</label>
          <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
            <SelectTrigger className="border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Tenant-scoped: all tickets belong to this cooperative.</p>
    </Card>
  )
}

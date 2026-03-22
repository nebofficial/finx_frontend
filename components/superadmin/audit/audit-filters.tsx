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

interface AuditFiltersProps {
  filters: {
    action: string
    organization: string
    user: string
    dateRange: string
  }
  onFiltersChange: (filters: any) => void
}

export default function AuditFilters({ filters, onFiltersChange }: AuditFiltersProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Action</label>
          <Select value={filters.action} onValueChange={(value) => onFiltersChange({ ...filters, action: value })}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="login">Login</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Organization</label>
          <Select value={filters.organization} onValueChange={(value) => onFiltersChange({ ...filters, organization: value })}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              <SelectItem value="green-valley">Green Valley Coop</SelectItem>
              <SelectItem value="urban-farmers">Urban Farmers Coop</SelectItem>
              <SelectItem value="mountain-ridge">Mountain Ridge Coop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">User</label>
          <Input
            placeholder="Search by email..."
            value={filters.user}
            onChange={(e) => onFiltersChange({ ...filters, user: e.target.value })}
            className="border-gray-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Date Range</label>
          <Select value={filters.dateRange} onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}

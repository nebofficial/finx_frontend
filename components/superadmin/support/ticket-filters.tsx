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

interface TicketFiltersProps {
  filters: {
    search: string
    status: string
    priority: string
    organization: string
  }
  onFiltersChange: (filters: any) => void
}

export default function TicketFilters({ filters, onFiltersChange }: TicketFiltersProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
          <Input
            placeholder="Search by subject or ID..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="border-gray-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Priority</label>
          <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
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
              <SelectItem value="riverside">Riverside Farm Coop</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}

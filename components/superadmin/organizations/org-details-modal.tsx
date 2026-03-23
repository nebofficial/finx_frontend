'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type TenantSummary = {
  id?: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  status?: string | null
}

interface OrgDetailsModalProps {
  org: TenantSummary | null
  planLabel?: string
  isOpen: boolean
  onClose: () => void
}

export default function OrgDetailsModal({ org, planLabel, isOpen, onClose }: OrgDetailsModalProps) {
  if (!org) return null

  const active = org.status === 'active' || org.status === 'trial'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{org.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 mt-1">{org.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900 mt-1">{org.phone || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge
                className={cn('mt-1', active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}
              >
                {org.status || '—'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Plan</label>
              <p className="text-gray-900 mt-1 capitalize font-semibold">{planLabel || '—'}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{org.address || '—'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

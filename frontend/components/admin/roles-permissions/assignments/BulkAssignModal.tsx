'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { UserItem } from '../types'
import { UserSelector } from './UserSelector'

interface Props {
  users: UserItem[]
  roleId: string
  onBulkAssign: (userIds: string[], roleId: string) => void
}

export function BulkAssignModal({ users, roleId, onBulkAssign }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline">Bulk Assign</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Bulk Assign Role</DialogTitle></DialogHeader>
        <UserSelector users={users} selectedIds={selectedIds} onToggle={toggleUser} />
        <DialogFooter>
          <Button
            onClick={() => {
              if (!roleId || selectedIds.length === 0) return
              onBulkAssign(selectedIds, roleId)
              setOpen(false)
              setSelectedIds([])
            }}
          >
            Assign to {selectedIds.length} users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

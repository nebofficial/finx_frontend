'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface Props {
  onClone: (name: string, description?: string) => void
}

export function CloneRoleModal({ onClone }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Clone</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone Role</DialogTitle>
          <DialogDescription>Create a copy for quick setup.</DialogDescription>
        </DialogHeader>
        <Input placeholder="New role name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <DialogFooter>
          <Button
            onClick={() => {
              if (!name.trim()) return
              onClone(name.trim(), description.trim() || undefined)
              setOpen(false)
              setName('')
              setDescription('')
            }}
          >
            Clone Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const mockAdmins = [
  { id: 'admin-1', name: 'John Smith', email: 'john@greenvalley.coop' },
  { id: 'admin-2', name: 'Sarah Johnson', email: 'sarah@urbanfarmers.coop' },
  { id: 'admin-3', name: 'Michael Brown', email: 'michael@mountainridge.coop' },
  { id: 'admin-4', name: 'Emily Davis', email: 'emily@riverside.coop' },
]

interface OrgAdminSelectorProps {
  currentAdmin: string
  currentAdminId: string
}

export default function OrgAdminSelector({ currentAdmin, currentAdminId }: OrgAdminSelectorProps) {
  const [selectedAdmin, setSelectedAdmin] = useState(currentAdminId)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const selectedAdminData = mockAdmins.find(a => a.id === selectedAdmin)

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Select Organization Admin</label>
        <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockAdmins.map(admin => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.name} ({admin.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAdminData && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Selected Admin</p>
            <p className="text-sm text-gray-600">{selectedAdminData.name}</p>
            <p className="text-sm text-gray-600">{selectedAdminData.email}</p>
          </div>
        </Card>
      )}

      <Button 
        onClick={handleSave} 
        disabled={isSaving || selectedAdmin === currentAdminId}
        className="w-full"
      >
        {isSaving ? 'Saving...' : 'Update Admin'}
      </Button>
    </div>
  )
}

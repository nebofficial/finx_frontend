'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertCircle } from 'lucide-react'

interface ImpersonationModalProps {
  organizationId: string
  organizationName: string
  onClose: () => void
}

export default function ImpersonationModal({
  organizationId,
  organizationName,
  onClose
}: ImpersonationModalProps) {
  const handleImpersonate = () => {
    // Simulate login action
    console.log(`[v0] Logging in as admin for organization: ${organizationName}`)
    // In a real app, this would trigger a server action to generate an SSO token
    window.location.href = `/login?organization=${organizationId}&mode=impersonate`
  }

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex gap-3 items-start">
            <AlertCircle className="text-orange-600 mt-0.5" size={20} />
            <div>
              <AlertDialogTitle>Login as Organization Admin</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                You are about to login as the administrator of <strong>{organizationName}</strong>. This allows you to troubleshoot issues from their perspective.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-900">
          This action will create a temporary session. You will be logged out when you close the browser or after 1 hour.
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleImpersonate} className="bg-primary hover:bg-primary/90">
            Continue Login
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

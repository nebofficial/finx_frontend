'use client'
import OrgForm from '@/components/superadmin/organizations/org-form'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
export default function AddOrganizationPage() {
  const router = useRouter()
  const onSuccess = () => {
    toast.success('Organization created successfully')
    router.push('/superadmin/organizations')
  }
  return (
    <OrgForm onSuccess={onSuccess} />
  )
}
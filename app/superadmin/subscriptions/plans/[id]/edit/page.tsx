import { redirect } from 'next/navigation'

export default function SuperAdminPlanEditRedirectPage() {
  redirect('/systemadmin/billing/plans')
}

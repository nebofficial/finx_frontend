import { redirect } from 'next/navigation'

export default function SuperAdminPlanAddRedirectPage() {
  redirect('/systemadmin/billing/plans')
}

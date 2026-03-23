import { redirect } from 'next/navigation'

export default async function SuperAdminTicketEditRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/superadmin/support/tickets/${id}`)
}

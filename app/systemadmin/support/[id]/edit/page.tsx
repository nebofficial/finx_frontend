import { redirect } from 'next/navigation'

export default async function SystemAdminSupportEditRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/systemadmin/support/${id}`)
}

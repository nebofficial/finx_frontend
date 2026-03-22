import { redirect } from 'next/navigation'

/** Legacy URL — new tickets are created under /systemadmin/support/new */
export default function AssignTicketRedirect() {
  redirect('/systemadmin/support/new')
}

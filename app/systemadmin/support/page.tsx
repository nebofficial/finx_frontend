import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SupportTickets from '@/components/systemadmin/support/support-tickets'
import SupportStats from '@/components/systemadmin/support/support-stats'

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Support & Tickets</h1>
        <p className="text-muted-foreground">Manage customer support tickets and inquiries</p>
      </div>

      <SupportStats />

      <div className="flex justify-end">
        <Link href="/admin/support/add">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus size={20} />
            New Ticket
          </Button>
        </Link>
      </div>

      <SupportTickets />
    </div>
  )
}

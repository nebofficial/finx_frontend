'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Eye, Send } from 'lucide-react'
import { useState } from 'react'

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const invoices = [
    {
      id: 'INV-2024-001',
      tenant: 'Acme Corporation',
      amount: '$2,450.00',
      plan: 'Enterprise',
      date: 'Jan 15, 2024',
      status: 'paid',
      dueDate: 'Jan 15, 2024',
    },
    {
      id: 'INV-2024-002',
      tenant: 'Tech Startup Inc',
      amount: '$450.00',
      plan: 'Professional',
      date: 'Jan 12, 2024',
      status: 'paid',
      dueDate: 'Jan 12, 2024',
    },
    {
      id: 'INV-2024-003',
      tenant: 'Global Solutions Ltd',
      amount: '$3,290.00',
      plan: 'Enterprise',
      date: 'Jan 10, 2024',
      status: 'paid',
      dueDate: 'Jan 10, 2024',
    },
    {
      id: 'INV-2024-004',
      tenant: 'Creative Agency',
      amount: '$149.00',
      plan: 'Professional',
      date: 'Jan 8, 2024',
      status: 'pending',
      dueDate: 'Jan 15, 2024',
    },
    {
      id: 'INV-2024-005',
      tenant: 'Innovation Labs',
      amount: '$2,450.00',
      plan: 'Enterprise',
      date: 'Jan 5, 2024',
      status: 'overdue',
      dueDate: 'Jan 12, 2024',
    },
    {
      id: 'INV-2024-006',
      tenant: 'Digital Services',
      amount: '$99.00',
      plan: 'Basic',
      date: 'Dec 28, 2023',
      status: 'paid',
      dueDate: 'Dec 28, 2023',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success'
      case 'pending':
        return 'bg-warning/10 text-warning'
      case 'overdue':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const totalRevenue = invoices
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[$,]/g, '')), 0)
    .toFixed(2)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Invoices</h1>
        <p className="text-muted-foreground mt-2">Manage and track customer invoices</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: invoices.length.toString() },
          { label: 'Paid', value: invoices.filter(i => i.status === 'paid').length.toString() },
          { label: 'Pending', value: invoices.filter(i => i.status === 'pending').length.toString() },
          { label: 'Total Revenue', value: `$${totalRevenue}` },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-muted-foreground text-xs mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by invoice ID or tenant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-input-border"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select className="px-4 py-2 border border-input-border rounded-lg bg-white text-card-foreground">
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Invoice ID</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Plan</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border-light hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-card-foreground">{invoice.id}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{invoice.tenant}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{invoice.plan}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-card-foreground">{invoice.amount}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{invoice.date}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{invoice.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button className="h-8 text-xs text-card-foreground bg-white hover:bg-muted border border-border-light">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {invoice.status !== 'paid' && (
                        <Button className="h-8 text-xs bg-primary hover:bg-primary-light text-primary-foreground">
                          <Send className="w-3 h-3 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 6 of 142 invoices</p>
          <div className="flex gap-2">
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              Previous
            </Button>
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

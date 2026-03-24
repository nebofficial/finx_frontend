'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Search, Download, Eye, Send, Printer, Mail } from 'lucide-react'
import { billingApi } from '@/services/api/billingApi'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'

export default function InvoicesPage() {
  const firstLoadRef = useRef(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [invoices, setInvoices] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    tenant_id: '',
    amount: 0,
    due_date: '',
    status: 'pending',
  })
  const [summary, setSummary] = useState({ totalInvoices: 0, paid: 0, pending: 0, totalRevenue: 0 })
  const [sendingId, setSendingId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success/10 text-success'
      case 'pending': return 'bg-warning/10 text-warning'
      case 'overdue': return 'bg-destructive/10 text-destructive'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const load = async () => {
    try {
      const [invoiceRes, summaryRes] = await Promise.all([
        billingApi.getInvoices({ search: searchTerm || undefined, status: statusFilter === 'all' ? undefined : statusFilter }),
        billingApi.getInvoiceSummary(),
      ])
      setInvoices(invoiceRes.data.data.invoices || [])
      setSummary({
        totalInvoices: summaryRes.data.data.totalInvoices || 0,
        paid: summaryRes.data.data.paid || 0,
        pending: summaryRes.data.data.pending || 0,
        totalRevenue: summaryRes.data.data.totalRevenue || 0,
      })
      const subs = await billingApi.getSubscriptions()
      const uniqueTenants = Array.from(new Map((subs.data.data.subscriptions || []).map((s: any) => [s.tenant?.id, s.tenant])).values()).filter(Boolean)
      setTenants(uniqueTenants)
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to load invoices.')
      if (process.env.NODE_ENV === 'development') console.error('[InvoicesPage] load failed:', err)
      toast.error(msg)
    }
  }

  useEffect(() => {
    if (!firstLoadRef.current) {
      firstLoadRef.current = true
      void load()
      return
    }
    void load()
  }, [statusFilter])

  const handleSend = async (id: string) => {
    setSendingId(id)
    try {
      await billingApi.sendInvoice(id)
      toast.success('Invoice emailed successfully')
      window.dispatchEvent(new CustomEvent('billing:data-changed'))
      await load()
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to send invoice'))
    } finally {
      setSendingId(null)
    }
  }

  /** Opens the OS default mail client (fallback if SMTP send fails). */
  const openInvoiceInMailClient = (invoice: any) => {
    const email = String(invoice.tenant_email || '').trim()
    if (!email) {
      toast.error('This tenant has no email on file.')
      return
    }
    const subject = encodeURIComponent(`Invoice ${invoice.invoice_no}`)
    const body = encodeURIComponent(
      `Hello,\n\nPlease find invoice ${invoice.invoice_no} for रू ${Number(invoice.amount).toFixed(2)}.\n\nThank you,\nFinX Billing`
    )
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`
  }

  const openView = (invoice: any) => {
    setSelectedInvoice(invoice)
    setViewOpen(true)
  }

  const handlePrint = (invoice: any) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      toast.error('Unable to open print window')
      return
    }
    printWindow.document.write(`
      <html><head><title>${invoice.invoice_no}</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>Invoice ${invoice.invoice_no}</h2>
        <p><strong>Tenant:</strong> ${invoice.tenant_name}</p>
        <p><strong>Plan:</strong> ${invoice.plan_name}</p>
        <p><strong>Amount:</strong> रू ${Number(invoice.amount).toFixed(2)}</p>
        <p><strong>Date:</strong> ${new Date(invoice.issued_at).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${invoice.status}</p>
      </body></html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const createInvoice = async () => {
    if (!form.tenant_id || !form.amount || !form.due_date) {
      toast.error('Tenant, amount and due date are required')
      return
    }
    try {
      setCreating(true)
      const subs = await billingApi.getSubscriptions({ tenant_id: form.tenant_id, limit: 1 })
      const sub = subs.data.data.subscriptions?.[0]
      await billingApi.createInvoice({
        tenant_id: form.tenant_id,
        subscription_id: sub?.id || null,
        amount: form.amount,
        due_date: form.due_date,
        status: form.status,
      })
      toast.success('Invoice created')
      window.dispatchEvent(new CustomEvent('billing:data-changed'))
      setCreateOpen(false)
      setForm({ tenant_id: '', amount: 0, due_date: '', status: 'pending' })
      await load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create invoice')
    } finally {
      setCreating(false)
    }
  }

  const handleExport = () => {
    if (!invoices.length) {
      toast.error('No invoice data available to export')
      return
    }

    const headers = [
      'Invoice ID',
      'Tenant',
      'Tenant Email',
      'Plan',
      'Amount',
      'Issued Date',
      'Due Date',
      'Status',
    ]

    const rows = invoices.map((invoice) => [
      invoice.invoice_no,
      invoice.tenant_name || '-',
      invoice.tenant_email || '-',
      invoice.plan_name || '-',
      Number(invoice.amount || 0).toFixed(2),
      new Date(invoice.issued_at).toLocaleDateString(),
      new Date(invoice.due_date).toLocaleDateString(),
      invoice.status,
    ])

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? '')
            return `"${value.replace(/"/g, '""')}"`
          })
          .join(',')
      )
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    link.href = url
    link.setAttribute('download', `invoices-${stamp}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Invoices exported successfully')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Invoices</h1>
        <p className="text-muted-foreground mt-2">Manage and track customer invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: summary.totalInvoices.toString() },
          { label: 'Paid', value: summary.paid.toString() },
          { label: 'Pending', value: summary.pending.toString() },
          { label: 'Total Revenue', value: `रू ${Number(summary.totalRevenue).toFixed(2)}` },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-muted-foreground text-xs mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by invoice ID or tenant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-input-border pr-10"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-input-border rounded-lg bg-white text-card-foreground">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground" onClick={() => void load()}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary-light text-primary-foreground" onClick={() => setCreateOpen(true)}>
            Create Invoice
          </Button>
        </div>
      </Card>

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
                  <td className="py-3 px-4 text-sm font-medium text-card-foreground">{invoice.invoice_no}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{invoice.tenant_name}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{invoice.plan_name}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-card-foreground">रू {Number(invoice.amount).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{new Date(invoice.issued_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-card-foreground">{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-card-foreground hover:bg-muted border border-transparent hover:border-border-light"
                            onClick={() => openView(invoice)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-card-foreground hover:bg-muted border border-transparent hover:border-border-light"
                            onClick={() => handlePrint(invoice)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Print</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-card-foreground hover:bg-muted border border-transparent hover:border-border-light"
                            disabled={sendingId === invoice.id}
                            onClick={() => handleSend(invoice.id)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send via server email (SMTP)</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-card-foreground hover:bg-muted border border-transparent hover:border-border-light"
                            type="button"
                            onClick={() => openInvoiceInMailClient(invoice)}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open in your email app (mailto)</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {invoices.length} invoices</p>
          <div className="flex gap-2">
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">Previous</Button>
            <Button className="border border-border-light text-card-foreground bg-white hover:bg-muted">Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Tenant</Label>
              <Select value={form.tenant_id} onValueChange={(v) => setForm((f) => ({ ...f, tenant_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant: any) => (
                    <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Amount</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createInvoice} disabled={creating}>{creating ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Invoice ID:</span> {selectedInvoice.invoice_no}</p>
              <p><span className="font-semibold">Tenant:</span> {selectedInvoice.tenant_name}</p>
              <p><span className="font-semibold">Email:</span> {selectedInvoice.tenant_email || '-'}</p>
              <p><span className="font-semibold">Plan:</span> {selectedInvoice.plan_name}</p>
              <p><span className="font-semibold">Amount:</span> रू {Number(selectedInvoice.amount).toFixed(2)}</p>
              <p><span className="font-semibold">Issued:</span> {new Date(selectedInvoice.issued_at).toLocaleDateString()}</p>
              <p><span className="font-semibold">Due:</span> {new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
              <p><span className="font-semibold">Status:</span> {selectedInvoice.status}</p>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

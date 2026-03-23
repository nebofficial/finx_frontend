'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { billingApi } from '@/services/api/billingApi'
import { getApiErrorMessage } from '@/lib/api-error'

interface Plan {
  id: string
  name: string
  price: number
  billing: 'monthly' | 'annual'
  features: number
  users: number
  status: 'active' | 'archived'
}

export default function PlansList() {
  const hasLoadedRef = useRef(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    max_users: 5,
    max_branches: 1,
    max_members: 100,
    trial_days: 14,
  })

  const loadPlans = async () => {
    setLoading(true)
    try {
      const res = await billingApi.getPlans()
      const mapped: Plan[] = (res.data.data.plans || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price_monthly || 0),
        billing: 'monthly',
        features: Object.keys(p.features || {}).length,
        users: Number(p.subscriptions_count || 0),
        status: p.is_active ? 'active' : 'archived',
      }))
      setPlans(mapped)
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to load plans.')
      if (process.env.NODE_ENV === 'development') console.error('[PlansList] getPlans failed:', err)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    void loadPlans()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      name: '',
      description: '',
      price_monthly: 0,
      price_yearly: 0,
      max_users: 5,
      max_branches: 1,
      max_members: 100,
      trial_days: 14,
    })
    setOpen(true)
  }

  const openEdit = (plan: Plan) => {
    setEditing(plan)
    setForm((prev) => ({ ...prev, name: plan.name, price_monthly: plan.price, price_yearly: plan.price * 10 }))
    setOpen(true)
  }

  const savePlan = async () => {
    if (!form.name.trim()) {
      toast.error('Plan name is required')
      return
    }
    try {
      setSaving(true)
      if (editing) {
        await billingApi.updatePlan(editing.id, form)
        toast.success('Plan updated')
      } else {
        await billingApi.createPlan({
          ...form,
          features: {},
          is_active: true,
        })
        toast.success('Plan created')
      }
      setOpen(false)
      await loadPlans()
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to save plan.'))
    } finally {
      setSaving(false)
    }
  }

  const archivePlan = async (id: string) => {
    try {
      await billingApi.deletePlan(id)
      toast.success('Plan archived')
      await loadPlans()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to archive plan.'))
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Subscription Plans</CardTitle>
        <Button onClick={openCreate} className="bg-primary hover:bg-green-700 text-primary-foreground h-8 text-sm">
          New Plan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? <p className="text-sm text-muted-foreground">Loading plans...</p> : null}
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-card-foreground">{plan.name}</h3>
                  <Badge className={plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {plan.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>${plan.price}/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span>
                  <span>{plan.features} features</span>
                  <span>{plan.users} subscriptions</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(plan)}>
                    <Edit size={16} className="mr-2" />
                    <span>Edit Plan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => archivePlan(plan.id)}>
                    <Trash2 size={16} className="mr-2" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Monthly Price</Label><Input type="number" value={form.price_monthly} onChange={(e) => setForm((f) => ({ ...f, price_monthly: Number(e.target.value) }))} /></div>
            <div><Label>Yearly Price</Label><Input type="number" value={form.price_yearly} onChange={(e) => setForm((f) => ({ ...f, price_yearly: Number(e.target.value) }))} /></div>
            <div><Label>Max Users</Label><Input type="number" value={form.max_users} onChange={(e) => setForm((f) => ({ ...f, max_users: Number(e.target.value) }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={savePlan} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

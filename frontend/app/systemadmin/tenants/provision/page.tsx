"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';
import {
  ArrowLeft, Building2, ShieldCheck, Mail, Phone,
  MapPin, Tag, CalendarDays, Loader2, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/* ── Design tokens ────────────────────────────────────────── */
const T = {
  cardBg: '#D7EEFC',
  border: '#bfdbf7',
  headerBg: '#eaf5fd',
  title: '#0e4f7a',
  sub: '#4a7fa5',
  inputBg: '#f0f9ff',
  inputBorder: '#bfdbf7',
  inputText: '#0e4f7a',
  labelColor: '#1a5f8a',
};

/* ── Interfaces ───────────────────────────────────────────── */
interface PlanItem { id: string; name: string; }

interface ProvisionFormState {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  plan_id: string;
  trial_days: number;
  super_admin_name: string;
  super_admin_email: string;
  super_admin_password: string;
}

const initialForm: ProvisionFormState = {
  name: '', slug: '', email: '', phone: '', address: '',
  plan_id: '', trial_days: 14,
  super_admin_name: '', super_admin_email: '', super_admin_password: '',
};

/* ── Helpers ──────────────────────────────────────────────── */
const toSlug = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/* ── Styled field wrapper ─────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label style={{ color: T.labelColor }} className="text-xs font-semibold uppercase tracking-wide">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

const inputCls = `border text-sm focus-visible:ring-1 focus-visible:ring-blue-400`;
const inputStyle = { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.inputText };

/* ── Page ─────────────────────────────────────────────────── */
export default function ProvisionTenantPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProvisionFormState>(initialForm);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/system/billing/plans');
        setPlans(res.data.data?.plans ?? []);
      } catch {
        toast.error('Failed to load subscription plans');
      } finally {
        setLoadingPlans(false);
      }
    })();
  }, []);

  const canSubmit = useMemo(() => Boolean(
    form.name.trim() && form.slug.trim() && form.email.trim() && form.plan_id &&
    form.super_admin_name.trim() && form.super_admin_email.trim() &&
    form.super_admin_password.trim().length >= 8
  ), [form]);

  const handleSubmit = async () => {
    if (!canSubmit) { toast.error('Please complete all required fields'); return; }
    setSaving(true);
    try {
      await api.post('/system/tenants', {
        name: form.name.trim(), slug: form.slug.trim(), email: form.email.trim(),
        phone: form.phone.trim() || undefined, address: form.address.trim() || undefined,
        plan_id: form.plan_id, trial_days: Number(form.trial_days) || 14,
        super_admin_name: form.super_admin_name.trim(),
        super_admin_email: form.super_admin_email.trim(),
        super_admin_password: form.super_admin_password,
      });
      toast.success('Tenant provisioned successfully');
      router.push('/systemadmin/tenants');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to provision tenant');
    } finally {
      setSaving(false);
    }
  };

  /* progress indicator */
  const filled = [
    form.name, form.slug, form.email, form.plan_id,
    form.super_admin_name, form.super_admin_email,
    form.super_admin_password.length >= 8 ? 'ok' : '',
  ].filter(Boolean).length;
  const pct = Math.round((filled / 7) * 100);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: T.title }} className="text-3xl font-bold tracking-tight">
            Provision New Tenant
          </h1>
          <p style={{ color: T.sub }} className="mt-1 text-sm">
            Create a cooperative record, allocate a plan, and generate the SuperAdmin account.
          </p>
        </div>
        <Link href="/systemadmin/tenants">
          <Button variant="outline" style={{ borderColor: T.border, color: T.title }}
            className="gap-2 bg-white/60 hover:bg-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Tenants
          </Button>
        </Link>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ backgroundColor: T.cardBg, borderColor: T.border }}
        className="rounded-xl border px-5 py-3 flex items-center gap-4 shadow-sm">
        <div className="flex-1">
          <div className="flex justify-between mb-1.5">
            <span style={{ color: T.sub }} className="text-xs font-medium">Form completion</span>
            <span style={{ color: T.title }} className="text-xs font-bold">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#059669' : '#3b82f6' }}
            />
          </div>
        </div>
        {pct === 100 && (
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Ready to provision
          </div>
        )}
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Cooperative Profile ── */}
        <Card style={{ backgroundColor: T.cardBg, borderColor: T.border }}
          className="xl:col-span-2 shadow-sm">
          <CardHeader style={{ backgroundColor: T.headerBg, borderBottom: `1px solid ${T.border}` }}
            className="rounded-t-xl px-6 py-4">
            <CardTitle style={{ color: T.title }} className="flex items-center gap-2 text-base font-semibold">
              <Building2 className="h-5 w-5 text-indigo-500" />
              Cooperative Profile
            </CardTitle>
            <CardDescription style={{ color: T.sub }} className="text-sm mt-0.5">
              Basic identity and subscription details.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <Field label="Cooperative Name" required>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="name" value={form.name} placeholder="e.g. DigiTiya Cooperative"
                  style={inputStyle} className={`${inputCls} pl-9`}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((p) => ({ ...p, name, slug: p.slug || toSlug(name) }));
                  }}
                />
              </div>
            </Field>

            <Field label="Slug (Tenant ID)" required>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="slug" value={form.slug} placeholder="e.g. digitiya"
                  style={inputStyle} className={`${inputCls} pl-9 font-mono`}
                  onChange={(e) => setForm((p) => ({ ...p, slug: toSlug(e.target.value) }))}
                />
              </div>
              <p style={{ color: T.sub }} className="text-xs mt-1">
                Auto-generated · used as database name prefix
              </p>
            </Field>

            <Field label="Tenant Email" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="email" type="email" value={form.email} placeholder="contact@coop.com"
                  style={inputStyle} className={`${inputCls} pl-9`}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </Field>

            <Field label="Phone">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="phone" value={form.phone} placeholder="+91 98765 43210"
                  style={inputStyle} className={`${inputCls} pl-9`}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </Field>

            <div className="md:col-span-2">
              <Field label="Address">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                  <Textarea
                    id="address" value={form.address} placeholder="Full address of the cooperative"
                    style={inputStyle} className={`${inputCls} pl-9 min-h-20 resize-none`}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </Field>
            </div>

            <Field label="Subscription Plan" required>
              <Select value={form.plan_id} onValueChange={(v) => setForm((p) => ({ ...p, plan_id: v }))}>
                <SelectTrigger style={inputStyle} className={`${inputCls}`}>
                  <SelectValue placeholder={loadingPlans ? 'Loading plans…' : 'Select a plan'} />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Trial Period (days)">
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="trial_days" type="number" min={1} value={form.trial_days}
                  style={inputStyle} className={`${inputCls} pl-9`}
                  onChange={(e) => setForm((p) => ({ ...p, trial_days: Number(e.target.value) }))}
                />
              </div>
            </Field>

          </CardContent>
        </Card>

        {/* ── SuperAdmin Panel ── */}
        <div className="flex flex-col gap-6">
          <Card style={{ backgroundColor: T.cardBg, borderColor: T.border }} className="shadow-sm">
            <CardHeader style={{ backgroundColor: T.headerBg, borderBottom: `1px solid ${T.border}` }}
              className="rounded-t-xl px-6 py-4">
              <CardTitle style={{ color: T.title }} className="flex items-center gap-2 text-base font-semibold">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                SuperAdmin Setup
              </CardTitle>
              <CardDescription style={{ color: T.sub }} className="text-sm mt-0.5">
                Bootstrap the first privileged tenant user.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <Field label="Full Name" required>
                <Input
                  id="super_admin_name" value={form.super_admin_name} placeholder="e.g. Ravi Kumar"
                  style={inputStyle} className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, super_admin_name: e.target.value }))}
                />
              </Field>

              <Field label="Email" required>
                <Input
                  id="super_admin_email" type="email" value={form.super_admin_email} placeholder="admin@coop.com"
                  style={inputStyle} className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, super_admin_email: e.target.value }))}
                />
              </Field>

              <Field label="Password" required>
                <Input
                  id="super_admin_password" type="password" value={form.super_admin_password}
                  placeholder="Min. 8 characters"
                  style={inputStyle} className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, super_admin_password: e.target.value }))}
                />
                {form.super_admin_password.length > 0 && form.super_admin_password.length < 8 && (
                  <p className="text-xs text-rose-500 mt-1">Password must be at least 8 characters</p>
                )}
              </Field>
            </CardContent>
          </Card>

          {/* ── Submit card ── */}
          <Card style={{ backgroundColor: '#eaf5fd', borderColor: T.border }} className="shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                {[
                  { label: 'Cooperative name', done: !!form.name },
                  { label: 'Unique slug', done: !!form.slug },
                  { label: 'Contact email', done: !!form.email },
                  { label: 'Subscription plan', done: !!form.plan_id },
                  { label: 'SuperAdmin name', done: !!form.super_admin_name },
                  { label: 'SuperAdmin email', done: !!form.super_admin_email },
                  { label: 'Strong password', done: form.super_admin_password.length >= 8 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-500' : 'bg-blue-200'
                      }`}>
                      {item.done && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span style={{ color: item.done ? '#065f46' : T.sub }} className="text-xs">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={saving || loadingPlans || !canSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-2 h-10"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning…</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Create & Provision Tenant</>
                )}
              </Button>

              {!canSubmit && (
                <p style={{ color: T.sub }} className="text-xs text-center">
                  Complete all required fields to enable provisioning.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

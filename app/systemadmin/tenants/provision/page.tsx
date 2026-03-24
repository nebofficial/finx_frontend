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
  short_name: string;
  registration_number: string;
  registration_date: string;
  cooperative_type: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
  website: string;
  country: string;
  state_province: string;
  district: string;
  city_village: string;
  full_address: string;
  logo_url: string;
  cover_image_url: string;
  office_photos: string;
  plan_id: string;
  trial_days: number;
  admin_name: string;
  admin_email: string;
  admin_password: string;
}

const initialForm: ProvisionFormState = {
  name: '', slug: '', short_name: '', registration_number: '', registration_date: '', cooperative_type: '', status: 'active',
  email: '', phone: '', website: '',
  country: '', state_province: '', district: '', city_village: '', full_address: '',
  logo_url: '', cover_image_url: '', office_photos: '',
  plan_id: '', trial_days: 14,
  admin_name: '', admin_email: '', admin_password: '',
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

  /** Emails stay manual; slug / tenant name / password can be auto-filled server-side. */
  const passwordOk =
    form.admin_password.trim().length === 0 ||
    form.admin_password.trim().length >= 8;
  const canSubmit = useMemo(() => Boolean(
    form.name.trim() && form.email.trim() && form.plan_id &&
    form.admin_email.trim() && passwordOk
  ), [form, passwordOk]);

  const handleSubmit = async () => {
    if (!canSubmit) { toast.error('Please complete all required fields'); return; }
    setSaving(true);
    toast.message('Provisioning tenant database — this can take 1–3 minutes. Do not close this tab.', {
      duration: 8000,
    });
    try {
      const res = await api.post(
        '/system/tenants',
        {
          name: form.name.trim(),
          slug: form.slug.trim() || undefined,
          short_name: form.short_name.trim() || undefined,
          registration_number: form.registration_number.trim() || undefined,
          registration_date: form.registration_date || undefined,
          cooperative_type: form.cooperative_type || undefined,
          status: form.status,
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          website: form.website.trim() || undefined,
          country: form.country.trim() || undefined,
          state_province: form.state_province.trim() || undefined,
          district: form.district.trim() || undefined,
          city_village: form.city_village.trim() || undefined,
          full_address: form.full_address.trim() || undefined,
          address: form.full_address.trim() || undefined,
          logo_url: form.logo_url.trim() || undefined,
          cover_image_url: form.cover_image_url.trim() || undefined,
          office_photos: form.office_photos.trim() || undefined,
          plan_id: form.plan_id,
          trial_days: Number(form.trial_days) || 14,
          admin_name: form.admin_name.trim() || undefined,
          admin_email: form.admin_email.trim(),
          admin_password:
            form.admin_password.trim().length >= 8
              ? form.admin_password
              : undefined,
        },
        { timeout: 300000 }
      );
      const genPw = res.data?.data?.generated_admin_password || res.data?.data?.generated_super_admin_password;
      if (genPw) {
        toast.success(`Tenant created. Admin password (save it now): ${genPw}`, { duration: 60000 });
      } else {
        toast.success('Tenant provisioned successfully');
      }
      router.push('/systemadmin/tenants');
    } catch (err: any) {
      const msg = String(err?.message || '');
      const timedOut =
        err?.code === 'ECONNABORTED' ||
        /timeout/i.test(msg) ||
        err?.response?.status === 504;
      const proxyDropped =
        err?.code === 'ECONNRESET' ||
        /socket hang up|network error|failed to proxy/i.test(msg);
      if (timedOut || proxyDropped) {
        toast.error(
          'The connection closed before the server finished (or timed out). Provisioning can take several minutes — check Tenants and refresh. If the new org appears, it completed successfully.',
          { duration: 14000 }
        );
      } else {
        toast.error(err?.response?.data?.message || msg || 'Failed to provision tenant');
      }
    } finally {
      setSaving(false);
    }
  };

  /* progress indicator */
  const filled = [
    form.name,
    form.email,
    form.plan_id,
    form.admin_email,
    passwordOk ? 'ok' : '',
  ].filter(Boolean).length;
  const pct = Math.round((filled / 5) * 100);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: T.title }} className="text-3xl font-bold tracking-tight">
            Provision New Tenant
          </h1>
          <p style={{ color: T.sub }} className="mt-1 text-sm">
            Create a tenant profile, allocate a plan, and generate the initial Admin account.
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

        {/* ── Tenant Profile ── */}
        <Card style={{ backgroundColor: T.cardBg, borderColor: T.border }}
          className="xl:col-span-2 shadow-sm">
          <CardHeader style={{ backgroundColor: T.headerBg, borderBottom: `1px solid ${T.border}` }}
            className="rounded-t-xl px-6 py-4">
            <CardTitle style={{ color: T.title }} className="flex items-center gap-2 text-base font-semibold">
              <Building2 className="h-5 w-5 text-indigo-500" />
              Tenant Profile
            </CardTitle>
            <CardDescription style={{ color: T.sub }} className="text-sm mt-0.5">
              Core organization details, address, and contact information.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <Field label="Tenant Name" required>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="name" value={form.name} placeholder="e.g. DigiTiya Cooperative"
                  style={inputStyle} className={`${inputCls} pl-9`}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((p) => ({ ...p, name }));
                  }}
                />
              </div>
            </Field>

            <Field label="Slug (optional)">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  id="slug"
                  value={form.slug}
                  placeholder={toSlug(form.name) || 'auto from name'}
                  style={inputStyle}
                  className={`${inputCls} pl-9 font-mono`}
                  onChange={(e) => setForm((p) => ({ ...p, slug: toSlug(e.target.value) }))}
                />
              </div>
              <p style={{ color: T.sub }} className="text-xs mt-1">
                Leave empty to auto-generate from the tenant name (unique on server).
              </p>
            </Field>

            <Field label="Short Name / Code">
              <Input
                id="short_name"
                value={form.short_name}
                placeholder="e.g. DCCL"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, short_name: e.target.value }))}
              />
            </Field>

            <Field label="Registration Number">
              <Input
                id="registration_number"
                value={form.registration_number}
                placeholder="e.g. REG-2026-001"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, registration_number: e.target.value }))}
              />
            </Field>

            <Field label="Registration Date">
              <Input
                id="registration_date"
                type="date"
                value={form.registration_date}
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, registration_date: e.target.value }))}
              />
            </Field>

            <Field label="Type of Cooperative">
              <Select value={form.cooperative_type} onValueChange={(v) => setForm((p) => ({ ...p, cooperative_type: v }))}>
                <SelectTrigger style={inputStyle} className={inputCls}>
                  <SelectValue placeholder="Select cooperative type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="multipurpose">Multipurpose</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Status">
              <Select value={form.status} onValueChange={(v: 'active' | 'inactive') => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger style={inputStyle} className={inputCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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

            <Field label="Website (optional)">
              <Input
                id="website"
                value={form.website}
                placeholder="https://example.org"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              />
            </Field>

            <Field label="Country">
              <Input
                id="country"
                value={form.country}
                placeholder="Country"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
              />
            </Field>

            <Field label="State / Province">
              <Input
                id="state_province"
                value={form.state_province}
                placeholder="State or Province"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, state_province: e.target.value }))}
              />
            </Field>

            <Field label="District">
              <Input
                id="district"
                value={form.district}
                placeholder="District"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
              />
            </Field>

            <Field label="City / Village">
              <Input
                id="city_village"
                value={form.city_village}
                placeholder="City or Village"
                style={inputStyle}
                className={inputCls}
                onChange={(e) => setForm((p) => ({ ...p, city_village: e.target.value }))}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Full Address">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                  <Textarea
                    id="full_address" value={form.full_address} placeholder="Full office address"
                    style={inputStyle} className={`${inputCls} pl-9 min-h-20 resize-none`}
                    onChange={(e) => setForm((p) => ({ ...p, full_address: e.target.value }))}
                  />
                </div>
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Organization Logo URL">
                <Input
                  id="logo_url"
                  value={form.logo_url}
                  placeholder="https://.../logo.png"
                  style={inputStyle}
                  className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, logo_url: e.target.value }))}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Cover Image URL">
                <Input
                  id="cover_image_url"
                  value={form.cover_image_url}
                  placeholder="https://.../cover.jpg"
                  style={inputStyle}
                  className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, cover_image_url: e.target.value }))}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Office Photos URLs (comma separated)">
                <Textarea
                  id="office_photos"
                  value={form.office_photos}
                  placeholder="https://.../office-1.jpg, https://.../office-2.jpg"
                  style={inputStyle}
                  className={`${inputCls} min-h-16 resize-none`}
                  onChange={(e) => setForm((p) => ({ ...p, office_photos: e.target.value }))}
                />
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

        {/* ── Admin Account Panel ── */}
        <div className="flex flex-col gap-6">
          <Card style={{ backgroundColor: T.cardBg, borderColor: T.border }} className="shadow-sm">
            <CardHeader style={{ backgroundColor: T.headerBg, borderBottom: `1px solid ${T.border}` }}
              className="rounded-t-xl px-6 py-4">
              <CardTitle style={{ color: T.title }} className="flex items-center gap-2 text-base font-semibold">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Admin Account Setup
              </CardTitle>
              <CardDescription style={{ color: T.sub }} className="text-sm mt-0.5">
                Bootstrap the first tenant Admin user.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <Field label="Full Name (optional)">
                <Input
                  id="admin_name"
                  value={form.admin_name}
                  placeholder="Defaults to tenant name"
                  style={inputStyle}
                  className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, admin_name: e.target.value }))}
                />
              </Field>

              <Field label="Email" required>
                <Input
                  id="admin_email" type="email" value={form.admin_email} placeholder="admin@coop.com"
                  style={inputStyle} className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, admin_email: e.target.value }))}
                />
              </Field>

              <Field label="Password (optional)">
                <Input
                  id="admin_password"
                  type="password"
                  value={form.admin_password}
                  placeholder="Leave empty to auto-generate"
                  style={inputStyle}
                  className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, admin_password: e.target.value }))}
                />
                {form.admin_password.length > 0 && form.admin_password.length < 8 && (
                  <p className="text-xs text-rose-500 mt-1">Use at least 8 characters or leave empty for auto-generate</p>
                )}
              </Field>
            </CardContent>
          </Card>

          {/* ── Submit card ── */}
          <Card style={{ backgroundColor: '#eaf5fd', borderColor: T.border }} className="shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                {[
                  { label: 'Tenant name', done: !!form.name },
                  { label: 'Contact email', done: !!form.email },
                  { label: 'Subscription plan', done: !!form.plan_id },
                  { label: 'Admin email', done: !!form.admin_email },
                  { label: 'Password (or auto)', done: passwordOk },
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

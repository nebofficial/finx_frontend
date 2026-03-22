"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CopyPlus, Play, Pause, Trash2, Building2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const THEME = {
  cardBg: '#D7EEFC',
  border: '#bfdbf7',
  headerBg: '#eaf5fd',
  rowHover: '#c8e5f8',
  titleColor: '#0e4f7a',
  subtitleColor: '#4a7fa5',
  tableHeadBg: '#bee3f8',
  tableHeadText: '#1a5f8a',
  codeChipBg: '#dbeafe',
  codeChipText: '#1e40af',
  monoText: '#5b7fa6',
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<{ id: string; name: string } | null>(null);
  const [dropDatabase, setDropDatabase] = useState(false);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/system/tenants');
      setTenants(res.data.data.tenants ?? []);
    } catch (err: any) {
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string, suspensionReason?: string) => {
    try {
      await api.patch(`/system/tenants/${id}/status`, {
        status: newStatus,
        suspension_reason:
          newStatus === 'suspended' ? suspensionReason ?? 'Suspended by SystemAdmin' : undefined,
      });
      toast.success(`Tenant marked as ${newStatus}`);
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openDeleteDialog = (id: string, name: string) => {
    setTenantToDelete({ id, name });
    setDropDatabase(false);
    setDeleteOpen(true);
  };

  const handleDeleteTenant = async () => {
    if (!tenantToDelete) return;
    try {
      await api.delete(`/system/tenants/${tenantToDelete.id}`, {
        data: { drop_database: dropDatabase },
      });
      toast.success('Tenant deleted successfully.');
      setDeleteOpen(false);
      setTenantToDelete(null);
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete tenant');
    }
  };

  const activeCount = tenants.filter((t) => t.status === 'active').length;
  const trialCount = tenants.filter((t) => t.status === 'trial').length;
  const suspendedCount = tenants.filter((t) => t.status === 'suspended' || t.status === 'inactive').length;

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: THEME.titleColor }} className="text-3xl font-bold tracking-tight">
            Tenant Management
          </h1>
          <p style={{ color: THEME.subtitleColor }} className="mt-1 text-sm">
            Provision, monitor, and manage all cooperative organisations on the FinX network.
          </p>
        </div>
        <Link href="/systemadmin/tenants/provision">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
            <CopyPlus className="w-4 h-4" />
            Provision New Tenant
          </Button>
        </Link>
      </div>

      {/* ── Quick-stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Tenants', value: tenants.length, color: '#0e4f7a' },
          { label: 'Active', value: activeCount + trialCount, color: '#065f46' },
          { label: 'Suspended / Inactive', value: suspendedCount, color: '#9f1239' },
        ].map((s) => (
          <div
            key={s.label}
            style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.border}` }}
            className="rounded-xl px-5 py-4 flex flex-col gap-1 shadow-sm"
          >
            <span style={{ color: THEME.subtitleColor }} className="text-xs font-medium uppercase tracking-wider">
              {s.label}
            </span>
            <span style={{ color: s.color }} className="text-2xl font-bold">
              {loading ? '…' : s.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Tenants Table ── */}
      <Card style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }} className="shadow-sm">
        <CardHeader style={{ backgroundColor: THEME.headerBg, borderBottom: `1px solid ${THEME.border}` }}
          className="rounded-t-xl px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 style={{ color: THEME.titleColor }} className="w-5 h-5" />
            <CardTitle style={{ color: THEME.titleColor }} className="text-lg font-semibold">
              Active Organisations
            </CardTitle>
          </div>
          <CardDescription style={{ color: THEME.subtitleColor }} className="text-sm mt-0.5">
            A complete list of mapped databases and their identifiers.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: THEME.tableHeadBg }} className="border-none hover:bg-transparent">
                  <TableHead style={{ color: THEME.tableHeadText }} className="font-semibold text-xs uppercase tracking-wide pl-6">
                    Organisation
                  </TableHead>
                  <TableHead style={{ color: THEME.tableHeadText }} className="font-semibold text-xs uppercase tracking-wide">
                    Slug / Database
                  </TableHead>
                  <TableHead style={{ color: THEME.tableHeadText }} className="font-semibold text-xs uppercase tracking-wide">
                    Status
                  </TableHead>
                  <TableHead style={{ color: THEME.tableHeadText }} className="font-semibold text-xs uppercase tracking-wide">
                    Joined
                  </TableHead>
                  <TableHead style={{ color: THEME.tableHeadText }} className="font-semibold text-xs uppercase tracking-wide text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={5} className="text-center py-12">
                      <div style={{ color: THEME.subtitleColor }} className="text-sm animate-pulse">
                        Loading tenants…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tenants.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={5} className="text-center py-12">
                      <span style={{ color: THEME.subtitleColor }} className="text-sm">
                        No tenants found. Provision one to get started.
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((t, idx) => (
                    <TableRow
                      key={t.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? THEME.cardBg : '#e8f4fb',
                        borderBottom: `1px solid ${THEME.border}`,
                      }}
                      className="transition-colors duration-150 hover:brightness-95"
                    >
                      {/* Name + email */}
                      <TableCell className="pl-6 py-3">
                        <span style={{ color: THEME.titleColor }} className="font-semibold text-sm block">
                          {t.name}
                        </span>
                        <span style={{ color: THEME.monoText }} className="text-xs mt-0.5 block">
                          {t.email}
                        </span>
                      </TableCell>

                      {/* Slug / DB */}
                      <TableCell className="py-3">
                        <div className="flex flex-col gap-1">
                          <code
                            style={{ backgroundColor: THEME.codeChipBg, color: THEME.codeChipText }}
                            className="text-xs px-2 py-0.5 rounded font-mono w-fit"
                          >
                            {t.slug}
                          </code>
                          <span style={{ color: THEME.monoText }} className="text-xs font-mono">
                            {t.db_name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status badge */}
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            t.status === 'active'
                              ? 'border-emerald-400/50 text-emerald-700 bg-emerald-100'
                              : t.status === 'trial'
                                ? 'border-amber-400/50 text-amber-700 bg-amber-100'
                                : t.status === 'inactive'
                                  ? 'border-slate-400/50 text-slate-600 bg-slate-100'
                                  : 'border-rose-400/50 text-rose-700 bg-rose-100'
                          }
                        >
                          {t.status.toUpperCase()}
                        </Badge>
                      </TableCell>

                      {/* Created at */}
                      <TableCell style={{ color: THEME.subtitleColor }} className="text-sm py-3">
                        {new Date(t.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right pr-6 py-3">
                        <div className="flex justify-end gap-1">
                          {(t.status === 'active' || t.status === 'trial') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(t.id, 'suspended')}
                              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg"
                              title="Suspend"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}

                          {(t.status === 'inactive' || t.status === 'suspended') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(t.id, 'active')}
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg"
                              title="Activate"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}

                          {t.status === 'trial' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(t.id, 'active')}
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg"
                              title="Activate from Trial"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(t.id, t.name)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setTenantToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Delete Tenant</DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  {tenantToDelete ? (
                    <>
                      You are about to permanently remove{' '}
                      <span className="font-semibold text-foreground">{tenantToDelete.name}</span>.
                      This action cannot be undone.
                    </>
                  ) : null}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 mt-2">
            <Checkbox
              checked={dropDatabase}
              onCheckedChange={(v) => setDropDatabase(Boolean(v))}
              id="drop-db"
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="drop-db" className="cursor-pointer font-medium text-rose-800">
                Drop tenant database
              </Label>
              <p className="text-sm text-rose-600">
                If enabled, the tenant's entire database will be permanently deleted.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteOpen(false);
                setTenantToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDeleteTenant}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

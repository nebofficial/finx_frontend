"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Building2, CreditCard, Activity } from 'lucide-react';
import { billingApi } from '@/services/api/billingApi';

export default function SystemDashboard() {
  const [stats, setStats] = useState<{
    totalTenants: number;
    activeTenants: number;
    mrr: number;
    activeSubs: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await billingApi.getAnalytics();
        const d = res.data?.data;
        const tenantStats = d?.tenants as { total?: number; active?: number } | undefined;
        const s = d?.stats;
        setStats({
          totalTenants: Number(tenantStats?.total ?? s?.total_tenants ?? 0),
          activeTenants: Number(tenantStats?.active ?? 0),
          mrr: Number(s?.mrr ?? 0),
          activeSubs: Number(s?.active_subscriptions ?? 0),
        });
      } catch (err) {
        console.error("Failed to load platform stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ color: '#1deb06ff' }} className="text-3xl font-bold tracking-tight mb-2 text-white">Platform Overview</h1>
        <p style={{ color: '#e209d4ff' }} className="text-slate-400">Global metrics and system health for the FinX network.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card style={{ backgroundColor: '#D7EEFC' }} className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Cooperatives</CardTitle>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats != null ? stats.totalTenants : '—'}</div>
            <p className="text-xs text-emerald-600 mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#D7EEFC' }} className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Tenants</CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.activeTenants || '-'}</div>
            <p className="text-xs text-slate-500 mt-1">Healthy</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#D7EEFC' }} className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">MRR Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {stats != null ? `रू ${stats.mrr.toFixed(2)}` : '—'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Estimated MRR</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#D7EEFC' }} className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active subscriptions</CardTitle>
            <Users className="w-4 h-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats != null ? stats.activeSubs : '—'}</div>
            <p className="text-xs text-slate-500 mt-1">Platform billing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card style={{ backgroundColor: '#D7EEFC' }} className="border-blue-200 col-span-2">
          <CardHeader>
            <CardTitle style={{ color: '#1deb06ff' }} className="text-slate-200">System Alerts</CardTitle>
            <CardDescription style={{ color: '#e209d4ff' }} className="text-slate-400">Recent critical actions across all tenant databases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ color: '#1deb06ff' }} className="text-sm text-slate-500 py-8 text-center border border-dashed border-slate-800 rounded-lg">
              No critical alerts reported in the last 24 hours.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

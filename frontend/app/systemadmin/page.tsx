"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Building2, CreditCard, Activity } from 'lucide-react';

export default function SystemDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/system/tenants');
        const tenants = res.data.data.tenants ?? [];
        setStats({
          totalTenants: tenants.length,
          activeTenants: tenants.filter((t: any) => t.status === 'active').length,
          totalRevenue: '$12,450', // Mock data
          avgUptime: '99.99%'     // Mock data
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
            <div className="text-2xl font-bold text-slate-800">{stats?.totalTenants || '-'}</div>
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
            <div className="text-2xl font-bold text-slate-800">{stats?.totalRevenue || '-'}</div>
            <p className="text-xs text-emerald-600 mt-1">+14% growth</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#D7EEFC' }} className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Active Users</CardTitle>
            <Users className="w-4 h-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">4,821</div>
            <p className="text-xs text-emerald-600 mt-1">Cross-tenant aggregation</p>
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

"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Banknote, Landmark, Target } from 'lucide-react';

export default function TenantAdminDashboard() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setSummary(res.data.data.summary);
      } catch (err) {
        console.error("Dashboard loaded without stats");
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Cooperative Dashboard</h1>
        <p className="text-slate-400">Your organization's key performance metrics at a glance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Members</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary?.total_members || '0'}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Loans</CardTitle>
            <Banknote className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary?.active_loans || '0'}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Deposits</CardTitle>
            <Landmark className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary?.active_deposits || '0'}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 hover:border-rose-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Today's Collections</CardTitle>
            <Target className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Number(summary?.today_collections || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-96 w-full rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-slate-500">
        Analytics Charts (Transactions over time) will appear here.
      </div>
    </div>
  );
}

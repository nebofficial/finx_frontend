"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data.data.members || []);
    } catch (err: any) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Member Directory</h1>
          <p className="text-slate-400">Manage individuals, their KYC status, and assigned profiles.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <UserPlus className="w-4 h-4" />
          Register Member
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-300">Name / No.</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">Branch</TableHead>
                  <TableHead className="text-slate-300">KYC Status</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading members...</TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">No members found.</TableCell>
                  </TableRow>
                ) : (
                  members.map((m) => (
                    <TableRow key={m.id} className="border-slate-800 hover:bg-slate-800/40 transition-colors">
                      <TableCell className="font-medium text-slate-200">
                        {m.name}
                        <div className="text-xs text-slate-500 mt-1 font-mono">{m.member_no}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm text-slate-400">
                          {m.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {m.email}</span>}
                          {m.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {m.phone}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {m.branch?.name || 'Unassigned'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            m.kyc_status === 'verified' ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                            m.kyc_status === 'pending' ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                            "border-rose-500/30 text-rose-400 bg-rose-500/10"
                          }
                        >
                          {m.kyc_status === 'verified' && <ShieldCheck className="w-3 h-3 mr-1" />}
                          {m.kyc_status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${m.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {m.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

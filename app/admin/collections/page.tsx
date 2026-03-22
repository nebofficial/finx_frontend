"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Map, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function CollectionsRouterPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansRes, usersRes] = await Promise.all([
          api.get('/loans/accounts'),       // In reality, this would filter by loans not currently assigned today, or active loans
          api.get('/superadmin/staff')      // Adjust to GET /branch/staff to find FieldCollectors
        ]);
        
        setLoans(loansRes.data.data.accounts || []);
        setCollectors((usersRes.data.data.staff || []).filter((u: any) => u.role === 'FieldCollector'));
      } catch (err) {
        console.error("Failed to load routing data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (selectedLoans.length === 0) return toast.error("Select at least one loan account");
    if (!selectedCollector) return toast.error("Select a Field Collector to assign");

    try {
      await api.post('/collections/assign', {
        loan_ids: selectedLoans,
        collector_id: selectedCollector
      });
      toast.success(`${selectedLoans.length} accounts assigned to collector.`);
      setSelectedLoans([]);
      setSelectedCollector('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const toggleSelectAll = () => {
    if (selectedLoans.length === loans.length) setSelectedLoans([]);
    else setSelectedLoans(loans.map(l => l.id));
  };

  const toggleSelect = (id: string) => {
    if (selectedLoans.includes(id)) setSelectedLoans(selectedLoans.filter(l => l !== id));
    else setSelectedLoans([...selectedLoans, id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Route Assignment</h1>
        <p className="text-slate-400">Map active loan accounts to specific Field Collectors for daily EMI recovery.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <CardTitle className="text-white">Active Accounts</CardTitle>
                <CardDescription className="text-slate-400 font-normal mt-1">Select accounts to bulk-assign to a route.</CardDescription>
              </div>
              <div className="text-sm text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {selectedLoans.length} accounts selected
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-800/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="w-12 text-center">
                      <Checkbox 
                        checked={selectedLoans.length === loans.length && loans.length > 0} 
                        onCheckedChange={toggleSelectAll} 
                        className="border-slate-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">Loan ID</TableHead>
                    <TableHead className="text-slate-300">Member</TableHead>
                    <TableHead className="text-slate-300">Daily Target (EMI)</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading accounts...</TableCell>
                    </TableRow>
                  ) : loans.length === 0 ? (
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">No active accounts</TableCell>
                    </TableRow>
                  ) : (
                    loans.map((loan) => (
                      <TableRow key={loan.id} className="border-slate-800 hover:bg-slate-800/60 transition-colors">
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={selectedLoans.includes(loan.id)} 
                            onCheckedChange={() => toggleSelect(loan.id)} 
                            className="border-slate-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-indigo-400">{loan.loan_no}</TableCell>
                        <TableCell className="text-slate-200">{loan.member?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-amber-400 font-medium">${Number(loan.emi_amount).toLocaleString()}</TableCell>
                        <TableCell>
                           {loan.assigned_collector_id ? (
                             <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 flex items-center w-fit py-0.5 rounded border border-emerald-500/20">Assigned</span>
                           ) : (
                             <span className="text-xs text-amber-500 bg-amber-500/10 px-2 flex items-center w-fit py-0.5 rounded border border-amber-500/20">Unassigned</span>
                           )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card className="bg-slate-900 border-slate-800 sticky top-24">
            <CardHeader className="bg-slate-800/30 border-b border-slate-800">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Map className="w-4 h-4 text-indigo-400" /> Dispatch Route
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Select Field Collector</label>
                <Select value={selectedCollector} onValueChange={setSelectedCollector}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Choose a collector" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    {collectors.length === 0 ? (
                      <SelectItem value="none" disabled>No collectors available</SelectItem>
                    ) : (
                      collectors.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">Route Summary</div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-white">{selectedLoans.length}</span>
                  <span className="text-sm text-slate-400 mb-1">stops</span>
                </div>
              </div>

              <Button 
                onClick={handleAssign}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
                disabled={selectedLoans.length === 0 || !selectedCollector}
              >
                <Send className="w-4 h-4 mr-2" />
                Dispatch Assignment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Banknote, FileText } from 'lucide-react';

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get('/loans/accounts');
        setLoans(res.data.data.accounts || []);
      } catch (err) {
        console.error("Failed to load loans");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Loan Accounts</h1>
          <p className="text-slate-400">View active loans, outstanding balances, and repayment tracking.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <FileText className="w-4 h-4" />
          Review Applications
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Active Loan Portfolio</CardTitle>
          <CardDescription className="text-slate-400">All disbursed and active loans generating EMI schedules.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-300">Loan ID / Member</TableHead>
                  <TableHead className="text-slate-300">Principal</TableHead>
                  <TableHead className="text-slate-300">Balance</TableHead>
                  <TableHead className="text-slate-300">EMI</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading portfolio...</TableCell>
                  </TableRow>
                ) : loans.length === 0 ? (
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">No active loans found.</TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan) => (
                    <TableRow key={loan.id} className="border-slate-800 hover:bg-slate-800/40 transition-colors">
                      <TableCell className="font-medium text-slate-200">
                        <div className="font-mono text-xs text-indigo-400 mb-1">{loan.loan_no}</div>
                        {loan.member?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        रू {Number(loan.principal_amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-amber-400 font-medium">
                        रू {Number(loan.outstanding_balance).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        रू {Number(loan.emi_amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            loan.status === 'active' ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                            loan.status === 'closed' ? "border-slate-500/30 text-slate-400 bg-slate-800/50" :
                            "border-rose-500/30 text-rose-400 bg-rose-500/10" // default/npa
                          }
                        >
                          {loan.status.toUpperCase()}
                        </Badge>
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

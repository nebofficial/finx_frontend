"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Target, Wallet, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FieldCollectorMobileApp() {
  const { user } = useAuth();
  const [route, setRoute] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');

  const fetchRoute = async () => {
    try {
      // In reality, this would query specifically for assignments today
      const res = await api.get('/loans/accounts');
      // For demo, we just show accounts assigned to the current collector
      const assigned = (res.data.data.accounts || []).filter((a: any) => a.assigned_collector_id === user?.id);
      setRoute(assigned);
    } catch (err) {
      console.error("Failed to load route");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRoute();
  }, [user]);

  const handleCollect = async (loanId: string, expectedEmi: number) => {
    try {
      const collectionAmount = Number(amount) || expectedEmi;
      await api.post(`/collections/emi`, {
        loan_id: loanId,
        amount: collectionAmount,
        payment_method: 'Cash'
      });
      toast.success('Collection successful!');
      setCollectingId(null);
      setAmount('');
      fetchRoute();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record collection');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-80px)] space-y-6 pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 shadow-[0_0_40px_rgba(79,70,229,0.3)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-indigo-200 text-sm font-medium mb-1">Today's Target</h2>
          <div className="text-4xl font-extrabold tracking-tight mb-4">
            रू {route.reduce((acc, curr) => acc + Number(curr.emi_amount), 0).toLocaleString()}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/10 pt-4">
            <div>
              <div className="text-indigo-200 text-xs uppercase tracking-wider mb-1">Total Stops</div>
              <div className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> {route.length}
              </div>
            </div>
            <div>
              <div className="text-indigo-200 text-xs uppercase tracking-wider mb-1">Completed</div>
              <div className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 0
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold text-slate-200">Active Route</h3>
          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 pointer-events-none">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading daily route...</div>
        ) : route.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-xl border border-dashed border-slate-800 text-slate-500">
            <Target className="w-8 h-8 mx-auto mb-3 opacity-20" />
            No accounts assigned for collection today.
          </div>
        ) : (
          route.map(stop => (
            <Card key={stop.id} className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium text-lg">{stop.member?.name || 'Unknown Client'}</h4>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                      <span className="font-mono text-indigo-400">{stop.loan_no}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-400">रू {Number(stop.emi_amount).toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Expected EMI</div>
                  </div>
                </div>
                
                {collectingId === stop.id ? (
                  <div className="bg-slate-950 p-4 border-t border-slate-800 flex gap-2 animate-in slide-in-from-top-2">
                    <Input 
                      autoFocus
                      type="number" 
                      placeholder={Number(stop.emi_amount).toString()}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-slate-900 border-emerald-500/50 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                    />
                    <Button 
                      onClick={() => handleCollect(stop.id, Number(stop.emi_amount))}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                    >
                      Confirm
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => { setCollectingId(null); setAmount(''); }}
                      className="text-slate-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-800/30 p-3 border-t border-slate-800">
                    <Button 
                      onClick={() => setCollectingId(stop.id)}
                      className="w-full bg-slate-800 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-slate-700 transition-all hover:border-indigo-500"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Record Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

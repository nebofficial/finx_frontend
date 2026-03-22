'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accounting & Ledger</h1>
        <p className="text-gray-600 mt-1">View and manage all accounting records</p>
      </div>

      <Tabs defaultValue="ledger" className="w-full">
        <TabsList>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="subledger">Sub Ledger</TabsTrigger>
          <TabsTrigger value="cashbank">Cash/Bank Ledger</TabsTrigger>
          <TabsTrigger value="trialbalance">Trial Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Ledger</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Account</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Debit</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">2024-03-{15 - i}</td>
                      <td className="px-4 py-3 text-gray-900">Cash Account</td>
                      <td className="px-4 py-3 text-right text-gray-900">₹{50000 * i}</td>
                      <td className="px-4 py-3 text-right text-gray-600">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subledger" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sub Ledger</h2>
            <div className="text-center text-gray-600 py-8">
              Sub ledger entries will appear here
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cashbank" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash/Bank Ledger</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50">
                  <p className="text-sm text-gray-600">Cash Balance</p>
                  <p className="text-2xl font-bold text-gray-900">₹2,50,000</p>
                </Card>
                <Card className="p-4 bg-green-50">
                  <p className="text-sm text-gray-600">Bank Balance</p>
                  <p className="text-2xl font-bold text-gray-900">₹5,75,000</p>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trialbalance" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trial Balance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Account</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Debit</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">Account {i}</td>
                      <td className="px-4 py-3 text-right text-gray-900">₹{100000 * i}</td>
                      <td className="px-4 py-3 text-right text-gray-600">-</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right text-gray-900">₹6,00,000</td>
                    <td className="px-4 py-3 text-right text-gray-900">₹6,00,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

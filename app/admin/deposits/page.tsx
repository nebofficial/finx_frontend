'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DepositsPage() {
  const deposits = [
    { id: 1, accountNumber: 'DEP001', holder: 'John Doe', type: 'Savings', amount: '₹50,000', interest: '7.5%', status: 'Active' },
    { id: 2, accountNumber: 'DEP002', holder: 'Jane Smith', type: 'Fixed Deposit', amount: '₹100,000', interest: '8.5%', status: 'Active' },
    { id: 3, accountNumber: 'DEP003', holder: 'Bob Wilson', type: 'Savings', amount: '₹30,000', interest: '7.5%', status: 'Closed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposits</h1>
          <p className="text-gray-600 mt-1">Manage member deposit accounts and withdrawals</p>
        </div>
        <Link href="/tenant/deposits/add">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Create Account
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Account #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Account Holder</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Interest Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{deposit.accountNumber}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{deposit.holder}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{deposit.type}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{deposit.amount}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{deposit.interest}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${deposit.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link href={`/tenant/deposits/${deposit.id}/edit`} className="inline">
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button variant="destructive" size="sm">Close</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

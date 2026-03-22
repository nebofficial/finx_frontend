'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDownRight, ArrowUpLeft } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  const transactions = [
    { id: 1, type: 'receipt', date: '2024-03-15', description: 'Deposit Entry - John Doe', amount: '+₹5,000', account: 'Savings' },
    { id: 2, type: 'payment', date: '2024-03-14', description: 'Loan Disbursement - Jane Smith', amount: '-₹50,000', account: 'Bank' },
    { id: 3, type: 'receipt', date: '2024-03-13', description: 'EMI Payment - Bob Wilson', amount: '+₹8,500', account: 'Bank' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage all transactions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/transactions/receipt">
            <Button variant="outline" className="gap-2">
              <Plus size={16} />
              Receipt Entry
            </Button>
          </Link>
          <Link href="/tenant/transactions/payment">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={16} />
              Payment Entry
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Account</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-600">{transaction.date}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{transaction.account}</td>
                  <td className={`px-6 py-3 text-sm font-medium ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <Button variant="outline" size="sm">View</Button>
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

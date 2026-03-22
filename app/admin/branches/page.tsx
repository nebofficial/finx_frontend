'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Users, TrendingUp } from 'lucide-react';

export default function BranchesPage() {
  const branches = [
    { id: 1, name: 'Main Branch', city: 'Mumbai', admin: 'Raj Kumar', members: 234, portfolio: '₹45.2L' },
    { id: 2, name: 'North Branch', city: 'Delhi', admin: 'Priya Singh', members: 156, portfolio: '₹28.5L' },
    { id: 3, name: 'West Branch', city: 'Pune', admin: 'Amit Patil', members: 89, portfolio: '₹12.3L' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-600 mt-1">Manage your cooperative branches and assign admins</p>
        </div>
        <Link href="/tenant/branches/add">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Add Branch
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <MapPin size={16} />
                  <span className="text-sm">{branch.city}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Admin</span>
                <span className="font-medium text-gray-900">{branch.admin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <span className="text-sm text-gray-600">{branch.members} members</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm text-gray-600">Portfolio: {branch.portfolio}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Link href={`/tenant/branches/${branch.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Edit</Button>
              </Link>
              <Button variant="destructive" size="sm" className="flex-1">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

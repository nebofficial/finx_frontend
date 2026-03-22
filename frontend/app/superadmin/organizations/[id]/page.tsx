'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OrgDetailsModal from '@/components/superadmin/organizations/org-details-modal'
import OrgAdminSelector from '@/components/superadmin/organizations/org-admin-selector'
import { ChevronLeft, Edit2, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'

interface Params {
  params: Promise<{ id: string }>
}

// Mock data
const mockOrg = {
  id: '1',
  name: 'Green Valley Cooperative',
  email: 'admin@greenvalley.coop',
  phone: '+1-555-0101',
  status: 'active',
  plan: 'premium',
  createdAt: '2024-01-15',
  members: 245,
  admin: 'John Smith',
  adminId: 'admin-1',
  description: 'Agricultural cooperative in the green valley region',
  website: 'www.greenvalley.coop',
  address: '123 Farm Road, Valley, ST 12345',
  trialEndsAt: null,
  subscriptionEndsAt: '2025-01-15'
}

export default function OrganizationDetailPage({ params }: Params) {
  const [org, setOrg] = useState(mockOrg)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/superadmin/organizations">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{org.name}</h1>
              <Badge className={org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {org.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mt-1">{org.email} • {org.phone}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 size={16} />
          Edit
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Members</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{org.members}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Plan</p>
          <p className="text-2xl font-bold text-primary mt-1 capitalize">{org.plan}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Organization Admin</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{org.admin}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm font-medium">Member Since</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{new Date(org.createdAt).toLocaleDateString()}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admin">Admin Management</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Website</label>
                <p className="text-gray-900 mt-1">{org.website}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900 mt-1">{org.address}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{org.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Unlock size={16} className="mr-2" />
                Generate SSO Login Link
              </Button>
              <Button className="w-full justify-start" variant="outline">
                {org.status === 'active' ? <Lock size={16} className="mr-2" /> : <Unlock size={16} className="mr-2" />}
                {org.status === 'active' ? 'Deactivate' : 'Activate'} Organization
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization Administrator</h2>
            <OrgAdminSelector currentAdmin={org.admin} currentAdminId={org.adminId} />
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Current Plan</label>
                <p className="text-gray-900 mt-1 capitalize font-semibold">{org.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Subscription Expires</label>
                <p className="text-gray-900 mt-1">{new Date(org.subscriptionEndsAt).toLocaleDateString()}</p>
              </div>
              <Button className="w-full gap-2">Upgrade Plan</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

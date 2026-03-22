import Sidebar from '@/components/superadmin/sidebar'
import Header from '@/components/superadmin/header'
import { ReactNode } from 'react'

export const metadata = {
  title: 'SuperAdmin Dashboard',
  description: 'Manage cooperatives, organizations, and system settings',
}

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

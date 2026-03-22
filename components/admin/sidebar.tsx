'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BarChart3, Banknote, Building2, Lock, LogOut, Menu, Settings, TrendingUp, Users, Wallet, X } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { icon: Building2, label: 'Dashboard', href: '/admin' },
    { icon: Building2, label: 'Branches', href: '/admin/branches' },
    { icon: Users, label: 'Members', href: '/admin/members' },
    { icon: Banknote, label: 'Deposits', href: '/admin/deposits' },
    { icon: Wallet, label: 'Loans', href: '/admin/loans' },
    { icon: TrendingUp, label: 'Transactions', href: '/admin/transactions' },
    { icon: BarChart3, label: 'Accounting', href: '/admin/accounting' },
    { icon: Lock, label: 'Roles & Permissions', href: '/admin/roles' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 hover:bg-muted rounded-lg"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-border transition-all duration-300 flex flex-col md:w-64 md:static fixed h-full z-40 shadow-sm overflow-hidden`}
      >
        <div className="p-6 border-b border-border bg-gradient-to-br from-primary to-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin</h1>
              <p className="text-xs text-blue-100">Operations</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-green-50 text-primary border-l-4 border-primary pl-3'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-500'} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border bg-gray-50 space-y-3">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-sm">
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>

          <div className="text-xs text-gray-600">
            <p className="font-semibold text-gray-900">Admin v1.0</p>
            <p className="text-gray-500">© 2024 All Rights Reserved</p>
          </div>
        </div>
      </aside>

      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Banknote,
  Building2,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: Building2, label: 'Dashboard', href: '/admin' },
  { icon: Building2, label: 'Branches', href: '/admin/branches' },
  { icon: Users, label: 'Members', href: '/admin/members' },
  { icon: Banknote, label: 'Deposits', href: '/admin/deposits' },
  { icon: Wallet, label: 'Loans', href: '/admin/loans' },
  { icon: TrendingUp, label: 'Transactions', href: '/admin/transactions' },
  { icon: BarChart3, label: 'Accounting', href: '/admin/accounting' },
  { icon: Lock, label: 'Roles & Permissions', href: '/admin/roles-permissions' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isExpanded = !collapsed || isHovered

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex flex-col bg-white border-r border-border shadow-sm
        transition-all duration-300 ease-in-out flex-shrink-0
        ${isExpanded ? 'w-64' : 'w-[68px]'}
      `}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-base font-bold text-primary">A</span>
        </div>
        {isExpanded && (
          <div className="transition-opacity duration-200 min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate">Admin</h1>
            <p className="text-xs text-blue-100 truncate">Operations</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3.5 top-[72px] z-50 w-7 h-7 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
      >
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-0.5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link key={item.href} href={item.href} title={!isExpanded ? item.label : undefined}>
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive
                    ? 'bg-green-50 text-primary border-l-4 border-primary pl-2'
                    : 'text-gray-700 hover:bg-gray-50'}
                  ${!isExpanded ? 'justify-center' : ''}
                `}
              >
                <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-border bg-gray-50">
          <p className="text-xs font-semibold text-gray-900">CoopHub · Admin</p>
          <p className="text-xs text-gray-400">Same layout as system console</p>
        </div>
      )}
    </aside>
  )
}

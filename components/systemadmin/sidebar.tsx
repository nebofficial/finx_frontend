'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Building2, Users, Lock, CreditCard, BarChart3,
  MessageSquare, Settings, Shield, Database, Key,
  ChevronDown, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/systemadmin' },
  {
    icon: Shield, label: 'System Admin', href: '/systemadmin/system',
    submenu: [
      { label: 'Platform Overview', href: '/systemadmin/system' },
      { label: 'Global Settings', href: '/systemadmin/system/settings' },
      { label: 'System Status', href: '/systemadmin/system/status' },
    ]
  },
  { icon: Building2, label: 'Tenants', href: '/systemadmin/tenants' },
  { icon: Users, label: 'Users', href: '/systemadmin/users' },
  { icon: Lock, label: 'Roles & Permissions', href: '/systemadmin/roles-permissions' },
  { 
    icon: CreditCard, 
    label: 'Billing', 
    href: '/systemadmin/billing',
    submenu: [
      { label: 'Subscriptions', href: '/systemadmin/billing' },
      { label: 'Plans', href: '/systemadmin/billing/plans' },
      { label: 'Invoices', href: '/systemadmin/billing/invoices' },
      { label: 'Revenue', href: '/systemadmin/billing/revenue' },
    ]
  },
  { icon: BarChart3, label: 'Analytics', href: '/systemadmin/analytics' },
  { 
    icon: Database,
    label: 'Monitoring',
    href: '/systemadmin/monitoring',
    submenu: [
      { label: 'Audit Logs', href: '/systemadmin/monitoring/audit-logs' },
      { label: 'Security', href: '/systemadmin/monitoring/security' },
      { label: 'Performance', href: '/systemadmin/monitoring/performance' },
    ]
  },
  { icon: MessageSquare, label: 'Support', href: '/systemadmin/support' },
  { 
    icon: Key,
    label: 'Integration',
    href: '/systemadmin/integration',
    submenu: [
      { label: 'API Keys', href: '/systemadmin/integration/api-keys' },
      { label: 'Webhooks', href: '/systemadmin/integration/webhooks' },
      { label: 'Rate Limiting', href: '/systemadmin/integration/rate-limiting' },
    ]
  },
  { icon: Settings, label: 'Settings', href: '/systemadmin/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const isExpanded = !collapsed || isHovered

  const toggleSubmenu = (href: string) => {
    if (!isExpanded) return  // don't expand submenus when collapsed
    setExpandedMenu(expandedMenu === href ? null : href)
  }

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (collapsed) setExpandedMenu(null) // auto-close submenus on hover exit if docked
      }}
      className={`
        relative flex flex-col bg-white border-r border-border shadow-sm
        transition-all duration-300 ease-in-out flex-shrink-0
        ${isExpanded ? 'w-64' : 'w-[68px]'}
      `}
    >
      {/* ── Brand header ── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-base font-bold text-primary">C</span>
        </div>
        {isExpanded && (
          <div className="transition-opacity duration-200">
            <h1 className="text-sm font-bold text-white leading-tight">CoopHub</h1>
            <p className="text-xs text-blue-100">Admin Panel</p>
          </div>
        )}
      </div>

      {/* ── Toggle button ── */}
      <button
        onClick={() => {
          setCollapsed((c) => !c)
          if (!collapsed) setExpandedMenu(null) // close submenus on collapse
        }}
        title={collapsed ? 'Pin sidebar open' : 'Dock sidebar (auto-expand on hover)'}
        className="absolute -right-3.5 top-[72px] z-50 w-7 h-7 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
      >
        {collapsed
          ? <PanelLeftOpen size={14} />
          : <PanelLeftClose size={14} />
        }
      </button>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-0.5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const hasSubmenu = 'submenu' in item && item.submenu
          const isActive = hasSubmenu
            ? pathname === item.href || pathname.startsWith(item.href + '/')
            : pathname === item.href
          const isMenuExpanded = isExpanded && expandedMenu === item.href

          return (
            <div key={item.href}>
              {hasSubmenu ? (
                <button
                  onClick={() => toggleSubmenu(item.href)}
                  title={!isExpanded ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isActive || isMenuExpanded
                      ? 'bg-green-50 text-primary border-l-4 border-primary pl-2'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    ${!isExpanded ? 'justify-center' : ''}
                  `}
                >
                  <Icon size={20} className={`flex-shrink-0 ${isActive || isMenuExpanded ? 'text-primary' : 'text-gray-500'}`} />
                  {isExpanded && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown
                        size={15}
                        className={`flex-shrink-0 transition-transform ${isMenuExpanded ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </button>
              ) : (
                <Link href={item.href} title={!isExpanded ? item.label : undefined}>
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                      ${isActive
                        ? 'bg-green-50 text-primary border-l-4 border-primary pl-2'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${!isExpanded ? 'justify-center' : ''}
                    `}
                  >
                    <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                    {isExpanded && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                  </div>
                </Link>
              )}

              {/* Sub-menu (only visible when expanded) */}
              {hasSubmenu && isMenuExpanded && (
                <div className="ml-3 mt-1 mb-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                  {item.submenu?.map((sub) => {
                    const isSubActive = pathname === sub.href
                    return (
                      <Link key={sub.href} href={sub.href}>
                        <div
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors
                            ${isSubActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
                          `}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-border bg-gray-50">
          <p className="text-xs font-semibold text-gray-900">CoopHub v1.0.0</p>
          <p className="text-xs text-gray-400">© 2024 All Rights Reserved</p>
        </div>
      )}
    </aside>
  )
}

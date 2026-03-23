'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Building2,
  Bell,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/superadmin' },
  {
    icon: Building2,
    label: 'Organization',
    href: '/superadmin/organizations',
    submenu: [
      { label: 'Overview', href: '/superadmin/organizations' },
      { label: 'Add / onboard', href: '/superadmin/organizations/add' },
    ],
  },
  {
    icon: MessageSquare,
    label: 'Support',
    href: '/superadmin/support',
    submenu: [
      { label: 'Tickets', href: '/superadmin/support' },
      { label: 'New ticket', href: '/superadmin/support/tickets/add' },
    ],
  },
  {
    icon: CreditCard,
    label: 'Subscriptions',
    href: '/superadmin/subscriptions',
    submenu: [
      { label: 'Overview', href: '/superadmin/subscriptions' },
      { label: 'Trials', href: '/superadmin/subscriptions/trials' },
      { label: 'Plans', href: '/superadmin/subscriptions/plans' },
    ],
  },
  {
    icon: Bell,
    label: 'Notifications',
    href: '/superadmin/notifications',
    submenu: [
      { label: 'Hub', href: '/superadmin/notifications' },
      { label: 'Announcements', href: '/superadmin/notifications/announcements' },
      { label: 'Alerts', href: '/superadmin/notifications/alerts' },
    ],
  },
  {
    icon: Shield,
    label: 'Audit',
    href: '/superadmin/audit',
    submenu: [
      { label: 'Overview', href: '/superadmin/audit' },
      { label: 'Activity', href: '/superadmin/audit/logs' },
      { label: 'Security', href: '/superadmin/audit/security' },
    ],
  },
  { icon: BarChart3, label: 'Configuration', href: '/superadmin/config' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const isExpanded = !collapsed || isHovered

  const toggleSubmenu = (href: string) => {
    if (!isExpanded) return
    setExpandedMenu(expandedMenu === href ? null : href)
  }

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (collapsed) setExpandedMenu(null)
      }}
      className={`
        relative flex flex-col bg-white border-r border-border shadow-sm
        transition-all duration-300 ease-in-out flex-shrink-0
        ${isExpanded ? 'w-64' : 'w-[68px]'}
      `}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-base font-bold text-primary">S</span>
        </div>
        {isExpanded && (
          <div className="transition-opacity duration-200 min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate">SuperAdmin</h1>
            <p className="text-xs text-blue-100 truncate">Tenant console</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setCollapsed((c) => !c)
          if (!collapsed) setExpandedMenu(null)
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3.5 top-[72px] z-50 w-7 h-7 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
      >
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-0.5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const hasSubmenu = 'submenu' in item && item.submenu
          const isActive = hasSubmenu
            ? pathname === item.href || pathname.startsWith(`${item.href}/`)
            : pathname === item.href
          const isMenuExpanded = isExpanded && expandedMenu === item.href

          return (
            <div key={item.href}>
              {hasSubmenu ? (
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.href)}
                  title={!isExpanded ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isActive || isMenuExpanded
                      ? 'bg-green-50 text-primary border-l-4 border-primary pl-2'
                      : 'text-gray-700 hover:bg-gray-50'}
                    ${!isExpanded ? 'justify-center' : ''}
                  `}
                >
                  <Icon size={20} className={`flex-shrink-0 ${isActive || isMenuExpanded ? 'text-primary' : 'text-gray-500'}`} />
                  {isExpanded && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown size={15} className={`flex-shrink-0 transition-transform ${isMenuExpanded ? 'rotate-180' : ''}`} />
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
                        : 'text-gray-700 hover:bg-gray-50'}
                      ${!isExpanded ? 'justify-center' : ''}
                    `}
                  >
                    <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                    {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </div>
                </Link>
              )}

              {hasSubmenu && isMenuExpanded && (
                <div className="ml-3 mt-1 mb-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                  {item.submenu?.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`)
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

      {isExpanded && (
        <div className="px-4 py-3 border-t border-border bg-gray-50">
          <p className="text-xs font-semibold text-gray-900">CoopHub · SuperAdmin</p>
          <p className="text-xs text-gray-400">Same layout as system console</p>
        </div>
      )}
    </aside>
  )
}

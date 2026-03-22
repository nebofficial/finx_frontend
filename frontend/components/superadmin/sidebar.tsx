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
  Menu,
  X,
  Shield,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/superadmin' },
  {
    icon: Building2,
    label: 'Organizations',
    href: '/superadmin/organizations',
    submenu: [
      { label: 'View Organizations', href: '/superadmin/organizations' },
      { label: 'Tenant Onboarding', href: '/superadmin/organizations/add' },
      { label: 'Update Organization Details', href: '/superadmin/organizations' },
      { label: 'Activate / Deactivate', href: '/superadmin/organizations' },
      { label: 'Assign Organization Admin', href: '/superadmin/organizations' },
      { label: 'Assign Subscription Plan', href: '/superadmin/subscriptions/plans' },
      { label: 'Secure Login (SSO/Impersonation)', href: '/superadmin/organizations' },
    ],
  },
  { icon: Building2, label: 'Tenants', href: '/superadmin/tenants' },
  { 
    icon: Bell, 
    label: 'Notifications', 
    href: '/superadmin/notifications',
    submenu: [
      { label: 'Announcements', href: '/superadmin/notifications/announcements' },
      { label: 'Alerts', href: '/superadmin/notifications/alerts' },
    ]
  },
  { icon: MessageSquare, label: 'Support', href: '/superadmin/support' },
  { 
    icon: CreditCard, 
    label: 'Subscriptions', 
    href: '/superadmin/subscriptions',
    submenu: [
      { label: 'Trials', href: '/superadmin/subscriptions/trials' },
      { label: 'Plans', href: '/superadmin/subscriptions/plans' },
    ]
  },
  { 
    icon: BarChart3,
    label: 'Audit & Monitoring',
    href: '/superadmin/audit',
    submenu: [
      { label: 'Audit Logs', href: '/superadmin/audit/logs' },
      { label: 'Security', href: '/superadmin/audit/security' },
    ]
  },
  { icon: Settings, label: 'Configuration', href: '/superadmin/config' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const toggleSubmenu = (href: string) => {
    setExpandedMenu(expandedMenu === href ? null : href)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 hover:bg-muted rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-border transition-all duration-300 flex flex-col md:w-64 md:static fixed h-full z-40 shadow-sm`}
      >
        <div className="p-6 border-b border-border bg-gradient-to-br from-primary to-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SuperAdmin</h1>
              <p className="text-xs text-blue-100">Control Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const hasSubmenu = 'submenu' in item && item.submenu
            const isExpanded = expandedMenu === item.href
            
            return (
              <div key={item.href}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      isActive || isExpanded
                        ? 'bg-green-50 text-primary border-l-4 border-primary pl-3'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className={isActive || isExpanded ? 'text-primary' : 'text-gray-500'} />
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link href={item.href}>
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
                )}
                
                {hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-0">
                    {item.submenu?.map((sub) => {
                      const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + '/')
                      return (
                        <Link key={sub.href} href={sub.href}>
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-colors ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{sub.label}</span>
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

        <div className="p-4 border-t border-border bg-gray-50">
          <div className="text-xs text-gray-600">
            <p className="font-semibold text-gray-900">SuperAdmin v1.0</p>
            <p className="text-gray-500">© 2024 All Rights Reserved</p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Building2, Users, WalletCards, CreditCard, 
  BookOpen, LayoutDashboard, Settings, Map, 
  FileText, ArrowRightLeft, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const routes = {
    SuperAdmin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Roles & Permissions', path: '/admin/roles-permissions', icon: ShieldAlert },
      { name: 'Branches', path: '/admin/branches', icon: Building2 },
      { name: 'Staff', path: '/admin/staff', icon: ShieldAlert },
      { name: 'Members', path: '/admin/members', icon: Users },
      { name: 'Deposits', path: '/admin/deposits', icon: WalletCards },
      { name: 'Loans', path: '/admin/loans', icon: CreditCard },
      { name: 'Transactions', path: '/admin/transactions', icon: ArrowRightLeft },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
    Admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Branches', path: '/admin/branches', icon: Building2 },
      { name: 'Members', path: '/admin/members', icon: Users },
      { name: 'Deposits', path: '/admin/deposits', icon: WalletCards },
      { name: 'Loans', path: '/admin/loans', icon: CreditCard },
      { name: 'Ledger', path: '/admin/ledger', icon: BookOpen },
    ],
    BranchAdmin: [
      { name: 'Dashboard', path: '/branchadmin', icon: LayoutDashboard },
      { name: 'Members', path: '/branchadmin/members', icon: Users },
      { name: 'Deposits', path: '/branchadmin/deposits', icon: WalletCards },
      { name: 'Loans', path: '/branchadmin/loans', icon: CreditCard },
      { name: 'Collections', path: '/branchadmin/collections', icon: Map },
    ],
    FieldCollector: [
      { name: 'My Route', path: '/collector', icon: Map },
      { name: 'Sync Offline', path: '/collector/sync', icon: ArrowRightLeft },
    ],
    SystemAdmin: [
      { name: 'Platform Overview', path: '/systemadmin', icon: LayoutDashboard },
      { name: 'Tenants', path: '/systemadmin/tenants', icon: Building2 },
      { name: 'Plans & Billing', path: '/systemadmin/billing', icon: FileText },
      { name: 'Roles & Permissions', path: '/systemadmin/roles-permissions', icon: ShieldAlert },
    ]
  };

  const navItems = routes[user.role as keyof typeof routes] || [];

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          FinX {user.type === 'platform' ? 'System' : 'Portal'}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <Icon size={18} className={cn("transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
          <p className="text-xs text-indigo-400 mt-0.5">{user.role}</p>
        </div>
      </div>
    </aside>
  );
}

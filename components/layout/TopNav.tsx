"use client";

import { useAuth } from '@/hooks/useAuth';
import { LogOut, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNav() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shadow-black/10">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search members, accounts, or branches..." 
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
            {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

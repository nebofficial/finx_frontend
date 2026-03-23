'use client'

import { Bell, Search, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { getAuthPayloadDisplay } from '@/lib/auth-display'

export default function Header() {
  const router = useRouter()
  const payload = useMemo(() => getAuthPayloadDisplay(), [])
  const email = payload?.email || 'Signed in'
  const role = payload?.role || 'SuperAdmin'

  const logout = () => {
    Cookies.remove('auth_token')
    Cookies.remove('refresh_token')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-border h-16 px-6 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="search"
            placeholder="Search in this cooperative…"
            className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground relative">
          <Bell size={20} />
        </Button>

        <div className="h-8 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gradient-to-br from-primary to-blue-600 text-white hover:opacity-90 w-10 h-10"
            >
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium text-card-foreground">{role}</div>
            <div className="px-2 pb-2 text-xs text-muted-foreground break-all">{email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/superadmin/organizations')}>
              <User size={16} className="mr-2" />
              <span>Organization</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/superadmin/config')}>
              <Settings size={16} className="mr-2" />
              <span>Configuration</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
              <LogOut size={16} className="mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

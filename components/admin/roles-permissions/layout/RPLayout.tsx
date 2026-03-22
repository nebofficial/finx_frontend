import { ReactNode } from 'react'

export function RPLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>
}

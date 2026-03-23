/**
 * Decode JWT payload (no verification). Safe for Edge middleware.
 */
export function decodeJwtPayload(token: string): { role?: string; email?: string } | null {
  if (!token || token.split('.').length < 2) return null
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
    return JSON.parse(json) as { role?: string; email?: string }
  } catch {
    return null
  }
}

/** Role → allowed path prefix. First match wins. */
export const ROLE_DASHBOARD: Record<string, string> = {
  SystemAdmin: '/systemadmin',
  Support: '/systemadmin',
  SuperAdmin: '/superadmin',
  Admin: '/admin',
  BranchAdmin: '/branchadmin',
  FieldCollector: '/collector',
}

export function getAllowedPrefix(role?: string): string | null {
  if (!role || typeof role !== 'string') return null
  return ROLE_DASHBOARD[role] ?? null
}

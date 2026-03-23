import Cookies from 'js-cookie'

/** Decode JWT payload for display only (not verified). */
export function getAuthPayloadDisplay(): { email?: string; role?: string; tenant_id?: string } | null {
  const token = Cookies.get('auth_token')
  if (!token || typeof token !== 'string' || token.split('.').length < 2) return null
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
    return JSON.parse(json) as { email?: string; role?: string; tenant_id?: string }
  } catch {
    return null
  }
}

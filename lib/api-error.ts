import type { AxiosError } from 'axios'

/**
 * Extract a user-facing message from axios/fetch errors (FinX API uses `{ success, message }`).
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const ax = err as AxiosError<{ message?: string; errors?: { msg?: string }[] }>
  const data = ax.response?.data as unknown
  if (data && typeof data === 'object' && 'message' in data && typeof (data as { message?: string }).message === 'string' && (data as { message: string }).message) {
    return (data as { message: string }).message
  }
  const errObj = data && typeof data === 'object' ? (data as { errors?: { msg?: string }[] }) : null
  if (errObj && Array.isArray(errObj.errors) && errObj.errors.length) {
    const parts = errObj.errors.map((e) => e?.msg).filter(Boolean)
    if (parts.length) return parts.join(' · ')
  }
  if (typeof data === 'string') {
    const s = data.trim()
    if (s) return s
  }
  if (ax.message && ax.code !== 'ERR_CANCELED') {
    if (ax.code === 'ERR_NETWORK' || ax.message === 'Network Error') {
      return 'Network error: is the API running? Check BACKEND_URL / NEXT_PUBLIC_API_URL and restart the dev server.'
    }
    return ax.message
  }
  return fallback
}

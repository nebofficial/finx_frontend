import type { AxiosError } from 'axios'

/**
 * Extract a user-facing message from axios/fetch errors (FinX API uses `{ success, message }`).
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const ax = err as AxiosError<{ message?: string; errors?: { msg?: string }[] }>
  const data = ax.response?.data
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' && data.message) {
    return data.message
  }
  if (Array.isArray(data?.errors) && data.errors.length) {
    const parts = data.errors.map((e) => e?.msg).filter(Boolean)
    if (parts.length) return parts.join(' · ')
  }
  if (typeof data === 'string' && data.trim()) return data
  if (ax.message && ax.code !== 'ERR_CANCELED') {
    if (ax.code === 'ERR_NETWORK' || ax.message === 'Network Error') {
      return 'Network error: is the API running? Check BACKEND_URL / NEXT_PUBLIC_API_URL and restart the dev server.'
    }
    return ax.message
  }
  return fallback
}

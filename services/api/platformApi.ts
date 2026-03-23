import api from '@/lib/axios'

export type PlatformStatusPayload = {
  database_ok: boolean
  smtp_configured: boolean
  node_env: string
  process: {
    uptime_seconds: number
    memory_heap_used_mb: number
    memory_heap_total_mb: number
  }
  host: {
    loadavg_1m: number
    loadavg_5m: number
    loadavg_15m: number
    freemem_mb: number
    totalmem_mb: number
    platform: string
  }
}

export const platformApi = {
  getStatus: () => api.get('/system/platform-status'),
}

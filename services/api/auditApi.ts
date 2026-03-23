import api from '@/lib/axios'

export const auditApi = {
  getLogs: (params?: Record<string, unknown>) => api.get('/system/audit', { params }),
}

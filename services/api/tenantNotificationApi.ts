import api from '@/lib/axios'

export const tenantNotificationApi = {
  list: (params?: Record<string, unknown>) => api.get('/notifications', { params }),
}

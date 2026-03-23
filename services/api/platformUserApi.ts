import api from '@/lib/axios'

export const platformUserApi = {
  list: (params?: Record<string, unknown>) => api.get('/system/platform-users', { params }),
  get: (id: string) => api.get(`/system/platform-users/${id}`),
  create: (payload: { name: string; email: string; password: string; role?: string }) =>
    api.post('/system/platform-users', payload),
  update: (id: string, payload: Record<string, unknown>) => api.put(`/system/platform-users/${id}`, payload),
}

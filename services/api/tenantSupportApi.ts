import api from '@/lib/axios'

export const tenantSupportApi = {
  list: (params?: Record<string, unknown>) => api.get('/support', { params }),
  get: (id: string) => api.get(`/support/${id}`),
  create: (body: { subject: string; description: string; category: string; priority: string }) =>
    api.post('/support', body),
  resolve: (id: string, resolution_notes: string) =>
    api.patch(`/support/${id}/resolve`, { resolution_notes }),
}

import api from '@/lib/axios'

export const supportApi = {
  getStats: () => api.get('/system/support/tickets/stats'),
  getTickets: (params?: Record<string, unknown>) => api.get('/system/support/tickets', { params }),
  getTicket: (id: string) => api.get(`/system/support/tickets/${id}`),
  createTicket: (payload: Record<string, unknown>) => api.post('/system/support/tickets', payload),
  reply: (id: string, formData: FormData) => api.post(`/system/support/tickets/${id}/reply`, formData),
  updateStatus: (id: string, payload: { status: string; resolution_notes?: string }) =>
    api.patch(`/system/support/tickets/${id}/status`, payload),
  assign: (id: string, payload: Record<string, unknown>) => api.patch(`/system/support/tickets/${id}/assign`, payload),
  getAgents: () => api.get('/system/support/agents'),
  getTenantUsers: (tenant_id: string) => api.get('/system/support/tenant-users', { params: { tenant_id } }),
  updateReply: (ticketId: string, replyId: string, message: string) =>
    api.patch(`/system/support/tickets/${ticketId}/replies/${replyId}`, { message }),
  deleteReply: (ticketId: string, replyId: string) =>
    api.delete(`/system/support/tickets/${ticketId}/replies/${replyId}`),
}

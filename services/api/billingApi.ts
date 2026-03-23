import api from '@/lib/axios'

export const billingApi = {
  getPlans: () => api.get('/system/billing/plans'),
  createPlan: (payload: Record<string, unknown>) => api.post('/system/billing/plans', payload),
  updatePlan: (id: string, payload: Record<string, unknown>) => api.put(`/system/billing/plans/${id}`, payload),
  deletePlan: (id: string) => api.delete(`/system/billing/plans/${id}`),

  getSubscriptions: (params?: Record<string, unknown>) => api.get('/system/billing/subscriptions', { params }),
  assignSubscription: (payload: Record<string, unknown>) => api.post('/system/billing/subscriptions/assign', payload),
  updateSubscription: (id: string, payload: Record<string, unknown>) =>
    api.put(`/system/billing/subscriptions/${id}`, payload),

  getInvoices: (params?: Record<string, unknown>) => api.get('/system/billing/invoices', { params }),
  getInvoiceSummary: () => api.get('/system/billing/invoices/summary'),
  createInvoice: (payload: Record<string, unknown>) => api.post('/system/billing/invoices', payload),
  updateInvoiceStatus: (id: string, payload: Record<string, unknown>) =>
    api.put(`/system/billing/invoices/${id}/status`, payload),
  sendInvoice: (id: string) => api.post(`/system/billing/invoices/${id}/send`),

  getAnalytics: () => api.get('/system/billing/analytics'),
}

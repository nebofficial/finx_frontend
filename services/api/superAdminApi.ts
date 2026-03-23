import api from '@/lib/axios'

export const superAdminApi = {
  getOrganization: () => api.get('/super-admin/organization'),
  updateOrganization: (body: {
    name: string
    email: string
    phone?: string | null
    address?: string | null
    logo_url?: string | null
  }) => api.put('/super-admin/organization', body),
  listUsers: (params?: Record<string, unknown>) => api.get('/super-admin/users', { params }),
  createUser: (body: {
    name: string
    email: string
    phone?: string
    role: string
    password: string
    branch_id?: string | null
  }) => api.post('/super-admin/users', body),
  updateUserStatus: (id: string, is_active: boolean) =>
    api.patch(`/super-admin/users/${id}/status`, { is_active }),
  getSubscription: () => api.get('/super-admin/subscription'),
}

import api from './axios';

// AUTH
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// CUSTOMERS
export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getOne: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  remove: (id) => api.delete(`/customers/${id}`),
  getCalendarEvents: (params) => api.get('/customers/calendar', { params }),
};

// PAYMENTS
export const paymentsAPI = {
  getAll: (params) => api.get('/payments', { params }),
  getOne: (id) => api.get(`/payments/${id}`),
  getByCustomer: (customerId) => api.get(`/payments/customer/${customerId}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  remove: (id) => api.delete(`/payments/${id}`),
};

// EXPENSES
export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getOne: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  remove: (id) => api.delete(`/expenses/${id}`),
};

// VENDORS
export const vendorsAPI = {
  getAll: (params) => api.get('/vendors', { params }),
  getOne: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  remove: (id) => api.delete(`/vendors/${id}`),
};

// INVENTORY
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getOne: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  stockIn: (id, data) => api.post(`/inventory/${id}/stock-in`, data),
  stockOut: (id, data) => api.post(`/inventory/${id}/stock-out`, data),
};

// VEHICLES
export const vehiclesAPI = {
  getAll: (params) => api.get('/vehicles', { params }),
  getOne: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  remove: (id) => api.delete(`/vehicles/${id}`),
};

// TASKS
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
};

// DASHBOARD
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

// REPORTS
export const reportsAPI = {
  getCustomerReport: (params) => api.get('/reports', { params: { ...params, type: 'customer-list' } }),
  getPaymentReport:  (params) => api.get('/reports', { params: { ...params, type: 'payment-report', startDate: params?.dateFrom, endDate: params?.dateTo } }),
  getExpenseReport:  (params) => api.get('/reports', { params: { ...params, type: 'expense-report', startDate: params?.dateFrom, endDate: params?.dateTo } }),
  getProfitLoss:     (params) => api.get('/reports', { params: { ...params, type: 'profit-loss',   startDate: params?.dateFrom, endDate: params?.dateTo } }),
};

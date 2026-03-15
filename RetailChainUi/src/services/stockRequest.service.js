import { axiosPrivate } from './api/axiosClient';

const stockRequestService = {
  createRequest: async (data) => {
    return axiosPrivate.post('/stock-request', data);
  },

  getStoreRequests: async (storeId) => {
    return axiosPrivate.get(`/stock-request/store/${storeId}`);
  },

  getPendingRequests: async () => {
    return axiosPrivate.get('/stock-request/pending');
  },

  getRequestById: async (id) => {
    return axiosPrivate.get(`/stock-request/${id}`);
  },

  approveRequest: async (id) => {
    return axiosPrivate.put(`/stock-request/${id}/approve`);
  },

  rejectRequest: async (id, reason) => {
    return axiosPrivate.put(`/stock-request/${id}/reject`, { reason });
  },

  cancelRequest: async (id, reason) => {
    return axiosPrivate.put(`/stock-request/${id}/cancel?reason=${encodeURIComponent(reason)}`);
  },
};

export default stockRequestService;

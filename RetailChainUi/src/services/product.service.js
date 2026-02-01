import { axiosPublic, axiosPrivate } from './api/axiosClient';

const productService = {
  getAllProducts: async (filters = {}) => {
    return axiosPublic.get('/product', { params: filters }).then(res => res.data);
  },

  getProductById: async (id) => {
    return axiosPublic.get('/product/' + id).then(res => res.data);
  },

  getProductChainStock: async () => {
    // TODO: Implement when backend endpoint is available
    return [];
  },

  createProduct: async (data) => {
    return axiosPrivate.post('/product', data);
  },

  updateProduct: async (id, data) => {
    return axiosPrivate.put('/product/' + id, data);
  },

  deleteProduct: async (id) => {
    return axiosPrivate.delete('/product/' + id);
  }
};

export default productService;

import { axiosPrivate } from './api/axiosClient';

const API_PATH = '/api/product/upload';
// Fix: Backend Product API path is /api/product, upload is /api/product/upload
const PRODUCT_API_PATH = '/api/product';

const productService = {
  getAllProducts: async (filters = {}) => {
    const response = await axiosPrivate.get(PRODUCT_API_PATH, { params: filters });
    return response;
  },

  getProductBySlug: async (slug) => {
    const response = await axiosPrivate.get(`${PRODUCT_API_PATH}/${slug}`);
    return response;
  },

  createProduct: async (data) => {
    const response = await axiosPrivate.post(PRODUCT_API_PATH, data);
    return response;
  },

  updateProduct: async (slug, data) => {
    const response = await axiosPrivate.put(`${PRODUCT_API_PATH}/${slug}`, data);
    return response;
  },

  getProductChainStock: async (id) => {
    return [
      { locationId: "WH01", locationName: "Kho Tổng", type: "Warehouse", stock: 100, status: "High" },
      { locationId: "S001", locationName: "Cửa hàng Q1", type: "Store", stock: 10, status: "Low" }
    ];
  }
};

export default productService;

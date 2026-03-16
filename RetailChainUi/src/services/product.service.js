import { axiosPrivate } from './api/axiosClient';

// Redundant variable removed or fixed if needed, but PRODUCT_API_PATH is the main concern.
// Just removing the misleading unused variable.

// Fix: Backend Product API path is /api/product, upload is /api/product/upload
const PRODUCT_API_PATH = '/product';

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

  createProductVariant: async (productId, data) => {
    const response = await axiosPrivate.post(`${PRODUCT_API_PATH}/${productId}/variants`, data);
    return response;
  },

  // Tạo variants hàng loạt: truyền sizes[] và colors[] (backend tự sinh size x color)
  createProductVariants: async (productId, data) => {
    const response = await axiosPrivate.post(`${PRODUCT_API_PATH}/${productId}/variants`, data);
    return response;
  },

  updateProduct: async (slug, data) => {
    const response = await axiosPrivate.put(`${PRODUCT_API_PATH}/${slug}`, data);
    return response;
  },

  getNextCode: async (categoryId) => {
    const response = await axiosPrivate.get(`${PRODUCT_API_PATH}/next-code?categoryId=${categoryId}`);
    return response;
  },

  getCategories: async () => {
    const response = await axiosPrivate.get(`${PRODUCT_API_PATH}/categories`);
    return response;
  },

  // --- Category CRUD ---
  getCategoryById: async (id) => {
    const response = await axiosPrivate.get(`${PRODUCT_API_PATH}/categories/${id}`);
    return response;
  },

  createCategory: async (data) => {
    const response = await axiosPrivate.post(`${PRODUCT_API_PATH}/categories`, data);
    return response;
  },

  updateCategory: async (id, data) => {
    const response = await axiosPrivate.put(`${PRODUCT_API_PATH}/categories/${id}`, data);
    return response;
  },

  deleteCategory: async (id) => {
    const response = await axiosPrivate.delete(`${PRODUCT_API_PATH}/categories/${id}`);
    return response;
  },

  getProductChainStock: async () => {
    return [
      { locationId: "WH01", locationName: "Kho Tổng", type: "Warehouse", stock: 100, status: "High" },
      { locationId: "S001", locationName: "Cửa hàng Q1", type: "Store", stock: 10, status: "Low" }
    ];
  }
};

export default productService;

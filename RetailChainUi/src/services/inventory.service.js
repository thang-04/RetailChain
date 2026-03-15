import { axiosPrivate } from './api/axiosClient';
import productService from './product.service';

const inventoryService = {
  // --- Real Backend APIs ---
  createWarehouse: async (data) => {
    return axiosPrivate.post('/inventory/warehouse', data);
  },

  getAllWarehouses: async () => {
    return axiosPrivate.get('/warehouse');
  },

  // Wrapper for product service
  getAllProducts: async () => {
    return productService.getAllProducts();
  },

  updateWarehouse: async (id, data) => {
    return axiosPrivate.put(`/inventory/warehouse/${id}`, data);
  },

  deleteWarehouse: async (id) => {
    return axiosPrivate.delete(`/inventory/warehouse/${id}`);
  },

  getStockByWarehouse: async (warehouseId) => {
    return axiosPrivate.get(`/inventory/stock/${warehouseId}`);
  },

  getStockByProduct: async (productId) => {
    return axiosPrivate.get(`/inventory/product/${productId}`);
  },

  importStock: async (data) => {
    // data: { warehouseId, note, items: [{ variantId, quantity, note }] }
    return axiosPrivate.post('/inventory/import', data);
  },

  exportStock: async (data) => {
    // data: { warehouseId, note, items: [{ variantId, quantity, note }] }
    return axiosPrivate.post('/inventory/export', data);
  },

  transferStock: async (data) => {
    // data: { sourceWarehouseId, targetWarehouseId, note, items: [{ variantId, quantity }] }
    return axiosPrivate.post('/inventory/transfer', data);
  },

  getStockInRecords: async () => {
    try {
      const response = await axiosPrivate.get('/inventory/documents?type=IMPORT');
      return response.data || [];
    } catch (error) {
      console.error("Fetch stock in error", error);
      return [];
    }
  },

  getStockOutRecords: async () => {
    try {
      const response = await axiosPrivate.get('/inventory/documents?type=TRANSFER');
      return response.data || [];
    } catch (error) {
      console.error("Fetch stock out error", error);
      return [];
    }
  },

  getTransferRecords: async () => {
    try {
      const response = await axiosPrivate.get('/inventory/documents?type=TRANSFER');
      return response.data || [];
    } catch (error) {
      console.error("Fetch transfer error", error);
      return [];
    }
  },

  deleteDocument: async (id) => {
    return axiosPrivate.delete(`/inventory/documents/${id}`);
  },

  importStockFromExcel: async (data) => {
    return axiosPrivate.post('/inventory/import/excel', data);
  },

  /**
   * Kiểm tra SKU có tồn tại trong hệ thống không.
   * GET /api/product/exists?sku={sku}
   * @param {string} sku - Mã SKU cần kiểm tra
   * @returns {Promise<{exists: boolean, productId: number|null, code: string}>}
   */
  checkSkuExists: async (sku) => {
    try {
      const response = await axiosPrivate.get(`/product/exists?sku=${encodeURIComponent(sku)}`);
      const res = typeof response === 'string' ? JSON.parse(response) : response;
      if (res && res.code === 200 && res.data) {
        return res.data;
      }
      return { exists: false, productId: null, code: sku };
    } catch (error) {
      console.error("Check SKU exists error:", error);
      return { exists: false, productId: null, code: sku, error: true };
    }
  },

  /**
   * Lấy danh sách lịch sử tồn kho (inventory history records).
   * GET /api/inventory-history/record
   * @returns {Promise<Array>} Mảng bản ghi lịch sử
   */
  getInventoryHistoryRecords: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append("search", params.search);
    if (params.action && params.action !== "all") searchParams.append("action", params.action);
    if (params.fromDate instanceof Date) searchParams.append("fromDate", params.fromDate.toISOString());
    if (params.toDate instanceof Date) searchParams.append("toDate", params.toDate.toISOString());
    if (typeof params.page === "number") searchParams.append("page", String(params.page));
    if (typeof params.size === "number") searchParams.append("size", String(params.size));

    const qs = searchParams.toString();
    const raw = await axiosPrivate.get(`/inventory-history/record${qs ? `?${qs}` : ""}`);
    const res = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (res && res.code === 200 && res.data) {
      return res.data;
    }
    return {
      items: [],
      totalElements: 0,
      page: params.page ?? 0,
      size: params.size ?? 10,
    };
  },

  /**
   * Lấy chi tiết một bản ghi lịch sử tồn kho theo id.
   * GET /api/inventory-history/record/{id}
   * @param {number} id - ID bản ghi
   * @returns {Promise<Object|null>} Chi tiết bản ghi hoặc null
   */
  getInventoryHistoryRecordById: async (id) => {
    const raw = await axiosPrivate.get(`/inventory-history/record/${id}`);
    const res = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (res && res.code === 200 && res.data) {
      return res.data;
    }
    return null;
  },

  // --- Wrapper for Legacy Components ---
  createStockIn: async (data) => {
    return inventoryService.importStock(data);
  },

  createStockOut: async (data) => {
    return inventoryService.exportStock(data);
  },

  createTransfer: async (data) => {
    return inventoryService.transferStock(data);
  },

  /**
   * Lấy tổng quan tồn kho phục vụ dashboard Inventory.
   * GET /api/inventory/overview
   */
  getInventoryOverview: async () => {
    const raw = await axiosPrivate.get('/inventory/overview');
    const res = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (res && res.code === 200 && res.data) {
      return res.data;
    }
    return null;
  },

  /**
   * Export lịch sử tồn kho dạng CSV theo filter (xử lý ở backend).
   */
  exportInventoryHistory: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append("search", params.search);
    if (params.action && params.action !== "all") searchParams.append("action", params.action);
    if (params.fromDate instanceof Date) searchParams.append("fromDate", params.fromDate.toISOString());
    if (params.toDate instanceof Date) searchParams.append("toDate", params.toDate.toISOString());

    const qs = searchParams.toString();
    const raw = await axiosPrivate.get(`/inventory-history/record/export${qs ? `?${qs}` : ""}`);
    // axiosPrivate interceptor trả về response.data, với CSV là string thuần.
    return typeof raw === "string" ? raw : (raw?.data ?? "");
  },

  /**
   * Lấy danh sách tất cả danh mục (categories).
   * GET /api/product/categories
   * @returns {Promise<Array>} Mảng categories
   */
  getAllCategories: async () => {
    try {
      const response = await axiosPrivate.get('/product/categories');
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  /**
   * Lấy danh sách tất cả nhà cung cấp (suppliers).
   * GET /api/supplier
   * @returns {Promise<Array>} Mảng suppliers
   */
  getAllSuppliers: async () => {
    try {
      const response = await axiosPrivate.get('/supplier');
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  }
};

export default inventoryService;

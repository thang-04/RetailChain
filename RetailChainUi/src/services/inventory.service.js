import { axiosPrivate } from './api/axiosClient';

// Mock data for Inventory & Reports (Kept for fallback or unfinished APIs)
// ... (Keep existing mock data variables if needed, or remove them to clean up)

const STOCK_IN_RECORDS = [
  { id: "SIR002", date: "2024-01-22", supplier: "Unilever VN", totalItems: 200, totalValue: 8500000, status: "Pending", warehouse: "Store A" },
  { id: "SIR003", date: "2024-01-23", supplier: "Coca-Cola", totalItems: 1000, totalValue: 12000000, status: "Completed", warehouse: "Central Warehouse" },
  { id: "SIR004", date: "2024-01-24", supplier: "Nestle", totalItems: 350, totalValue: 9200000, status: "Processing", warehouse: "Store B" },
];

const STOCK_OUT_RECORDS = [
  { id: "SOR001", date: "2024-01-26", reason: "Sales Order", totalItems: 120, totalValue: 3500000, status: "Completed", warehouse: "Central Warehouse" },
  { id: "SOR002", date: "2024-01-27", reason: "Expired", totalItems: 50, totalValue: 1200000, status: "Pending", warehouse: "Store A" },
  { id: "SOR003", date: "2024-01-27", reason: "Damage", totalItems: 10, totalValue: 500000, status: "Completed", warehouse: "Central Warehouse" },
];

const TRANSFER_RECORDS = [
  { id: "TRF001", date: "2024-01-25", from: "Central Warehouse", to: "Store A", totalItems: 500, status: "Completed", createdBy: "Admin" },
  { id: "TRF002", date: "2024-01-26", from: "Store B", to: "Store C", totalItems: 200, status: "In Transit", createdBy: "Manager B" },
  { id: "TRF003", date: "2024-01-28", from: "Central Warehouse", to: "Store B", totalItems: 1000, status: "Pending", createdBy: "Admin" },
];

const STOCK_LEDGER = [
  { id: "TRX001", date: "2024-01-25 08:30", type: "Stock In", product: "Milk 1L", quantity: 100, location: "Store A", ref: "SIR001", user: "Nguyen Van A" },
  { id: "TRX002", date: "2024-01-25 09:15", type: "Sales", product: "Milk 1L", quantity: -2, location: "Store A", ref: "ORD998", user: "System" },
  { id: "TRX003", date: "2024-01-25 10:00", type: "Transfer", product: "Shampoo X", quantity: -50, location: "Central Warehouse", ref: "TRF005", user: "Le Van C" },
  { id: "TRX004", date: "2024-01-25 10:00", type: "Transfer", product: "Shampoo X", quantity: 50, location: "Store B", ref: "TRF005", user: "Le Van C" },
];

const STORE_INVENTORY = [
  { id: "P001", name: "Fresh Milk 1L", category: "Dairy", stock: 150, minStock: 20, status: "Good", lastUpdated: "2024-01-25" },
  { id: "P002", name: "Orange Juice", category: "Beverage", stock: 8, minStock: 15, status: "Low Stock", lastUpdated: "2024-01-24" },
  { id: "P003", name: "Rice 5kg", category: "Food", stock: 0, minStock: 10, status: "Out of Stock", lastUpdated: "2024-01-20" },
  { id: "P004", name: "Shampoo 500ml", category: "Personal Care", stock: 45, minStock: 10, status: "Good", lastUpdated: "2024-01-23" },
];

const CHAIN_WIDE_STOCK = [
  { storeId: "S001", storeName: "Store A (District 1)", stock: 150, status: "High" },
  { storeId: "S002", storeName: "Store B (District 3)", stock: 45, status: "Normal" },
  { storeId: "S003", storeName: "Store C (Thu Duc)", stock: 10, status: "Low" },
  { storeId: "WH01", storeName: "Central Warehouse", stock: 5000, status: "High" },
];

const MOCK_ALL_INVENTORIES = [
  {
    id: 1,
    region: "NY",
    storeName: "Store A - Downtown",
    storeId: "ST-1001",
    skuCount: "1,240",
    totalStock: "15,400",
    healthScore: 98,
    lowItems: "2",
    status: "Healthy",
    lastUpdated: "2 min ago"
  },
  {
    id: 2,
    region: "CA",
    storeName: "Store B - Westside Mall",
    storeId: "ST-2045",
    skuCount: "3,500",
    totalStock: "42,150",
    healthScore: 60,
    lowItems: "23",
    status: "Warning",
    lastUpdated: "1 hr ago"
  },
  {
    id: 3,
    region: "TX",
    storeName: "Store C - Austin Flagship",
    storeId: "ST-3301",
    skuCount: "850",
    totalStock: "2,300",
    healthScore: 25,
    lowItems: "140",
    status: "Critical",
    lastUpdated: "Just now"
  },
  {
    id: 4,
    region: "WA",
    storeName: "Store D - Seattle North",
    storeId: "ST-4102",
    skuCount: "2,100",
    totalStock: "18,900",
    healthScore: 88,
    lowItems: "12",
    status: "Healthy",
    lastUpdated: "5 hrs ago"
  },
  {
    id: 5,
    region: "FL",
    storeName: "Store E - Miami Bayside",
    storeId: "ST-5509",
    skuCount: "1,800",
    totalStock: "12,500",
    healthScore: 55,
    lowItems: "45",
    status: "Warning",
    lastUpdated: "12 hrs ago"
  }
];

const REPORT_DATA = {
  inventoryValue: 1250000000,
  turnoverRate: 4.5,
  lowStockItems: 12,
  stockDistribution: [
    { name: 'Store A', value: 30 },
    { name: 'Store B', value: 25 },
    { name: 'Store C', value: 15 },
    { name: 'Warehouse', value: 30 },
  ]
};

const inventoryService = {
  // --- Real Backend APIs ---
  createWarehouse: async (data) => {
    return axiosPrivate.post('/inventory/warehouse', data);
  },

  getAllWarehouses: async () => {
    return axiosPrivate.get('/inventory/warehouse');
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

  getAllProducts: async () => {
    return axiosPrivate.get('/product');
  },

  deleteDocument: async (id) => {
    return axiosPrivate.delete(`/inventory/documents/${id}`);
  },

  // --- Wrapper for Legacy Components (To be refactored) ---
  createStockIn: async (data) => {
    return inventoryService.importStock(data);
  },

  createStockOut: async (data) => {
    return inventoryService.exportStock(data);
  },

  createTransfer: async (data) => {
    return inventoryService.transferStock(data);
  },

  // --- Mock Methods (Legacy/Placeholder) ---
  // --- Real API Implementation ---
  getStockInRecords: async () => {
    try {
      // baseURL already includes /retail-chain/api
      const response = await axiosPrivate.get('/inventory/documents?type=IMPORT');
      return response.data || [];
    } catch (error) {
      console.error("Fetch stock in error", error);
      return [];
    }
  },

  getStockOutRecords: async () => {
    try {
      const response = await axiosPrivate.get('/inventory/documents?type=EXPORT');
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

  createStockIn: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newRecord = { ...data, id: `SIR${Date.now()}`, date: new Date().toISOString().split('T')[0], status: "Pending" };
    STOCK_IN_RECORDS.unshift(newRecord);
    return newRecord;
  },

  createStockOut: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newRecord = { ...data, id: `SOR${Date.now()}`, date: new Date().toISOString().split('T')[0], status: "Pending" };
    STOCK_OUT_RECORDS.unshift(newRecord);
    return newRecord;
  },

  createTransfer: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newRecord = { ...data, id: `TRF${Date.now()}`, date: new Date().toISOString().split('T')[0], status: "Pending" };
    TRANSFER_RECORDS.unshift(newRecord);
    return newRecord;
  },

  getStockLedger: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return STOCK_LEDGER;
  },

  getStoreInventory: async (storeId) => { // eslint-disable-line no-unused-vars
    await new Promise(resolve => setTimeout(resolve, 500));
    return STORE_INVENTORY;
  },

  getAllInventories: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_ALL_INVENTORIES;
  },

  getStockByProduct: async (productId) => {
    return axiosPrivate.get(`/inventory/product/${productId}`);
  },

  getProductChainStock: async (productId) => {
    return inventoryService.getStockByProduct(productId);
  },

  getExecutiveReport: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return REPORT_DATA;
  }
};

export default inventoryService;


// Mock data for Inventory & Reports

const STOCK_IN_RECORDS = [
  { id: "SIR001", date: "2024-01-20", supplier: "Vinamilk Corp", totalItems: 500, totalValue: 15000000, status: "Completed", warehouse: "Central Warehouse" },
  { id: "SIR002", date: "2024-01-22", supplier: "Unilever VN", totalItems: 200, totalValue: 8500000, status: "Pending", warehouse: "Store A" },
  { id: "SIR003", date: "2024-01-23", supplier: "Coca-Cola", totalItems: 1000, totalValue: 12000000, status: "Completed", warehouse: "Central Warehouse" },
  { id: "SIR004", date: "2024-01-24", supplier: "Nestle", totalItems: 350, totalValue: 9200000, status: "Processing", warehouse: "Store B" },
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
  getStockInRecords: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return STOCK_IN_RECORDS;
  },

  getStockLedger: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return STOCK_LEDGER;
  },

  getStoreInventory: async (storeId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return STORE_INVENTORY;
  },

  getProductChainStock: async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return CHAIN_WIDE_STOCK;
  },

  getExecutiveReport: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return REPORT_DATA;
  }
};

export default inventoryService;

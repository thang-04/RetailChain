// Mock data for Product Module

const PRODUCTS = [
  { 
    id: "P001", 
    name: "Fresh Milk 1L", 
    sku: "DAIRY-001",
    category: "Dairy", 
    price: 35000, 
    cost: 28000,
    unit: "Bottle",
    status: "Active",
    totalStock: 5000,
    supplier: "Vinamilk Corp"
  },
  { 
    id: "P002", 
    name: "Orange Juice", 
    sku: "BEV-002",
    category: "Beverage", 
    price: 45000, 
    cost: 32000,
    unit: "Bottle",
    status: "Active",
    totalStock: 2500,
    supplier: "Coca-Cola"
  },
  { 
    id: "P003", 
    name: "Rice 5kg", 
    sku: "FOOD-003",
    category: "Food", 
    price: 120000, 
    cost: 95000,
    unit: "Bag",
    status: "Low Stock",
    totalStock: 150,
    supplier: "Local Farm"
  },
  { 
    id: "P004", 
    name: "Shampoo 500ml", 
    sku: "PC-004",
    category: "Personal Care", 
    price: 85000, 
    cost: 60000,
    unit: "Bottle",
    status: "Active",
    totalStock: 1200,
    supplier: "Unilever VN"
  },
];

const PRODUCT_CHAIN_STOCK = {
  "P001": [
    { locationId: "WH01", locationName: "Central Warehouse", type: "Warehouse", stock: 2000, status: "High" },
    { locationId: "S001", locationName: "Store A (District 1)", type: "Store", stock: 150, status: "Normal" },
    { locationId: "S002", locationName: "Store B (District 3)", type: "Store", stock: 80, status: "Low" },
    { locationId: "S003", locationName: "Store C (Thu Duc)", type: "Store", stock: 200, status: "High" }
  ]
  // Add more mappings as needed
};

const productService = {
  getAllProducts: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real app, apply filters (category, search, status) here
    return PRODUCTS;
  },

  getProductById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  },

  getProductChainStock: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return PRODUCT_CHAIN_STOCK[id] || PRODUCT_CHAIN_STOCK["P001"];
  },

  createProduct: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newProduct = { ...data, id: `P${Date.now()}` };
    console.log("Created product:", newProduct);
    return newProduct;
  },

  updateProduct: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Updated product ${id}:`, data);
    return { id, ...data };
  },

  deleteProduct: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Deleted product ${id}`);
    return true;
  }
};

export default productService;

// Mock data for Store Module

const STORES = [
  { 
    id: "S001", 
    name: "Store A (District 1)", 
    address: "123 Nguyen Hue, D1, HCMC", 
    manager: "Nguyen Van A", 
    phone: "0901234567", 
    status: "Active", 
    revenue: "2.4B",
    type: "Flagship" 
  },
  { 
    id: "S002", 
    name: "Store B (District 3)", 
    address: "456 Vo Van Tan, D3, HCMC", 
    manager: "Tran Thi B", 
    phone: "0909876543", 
    status: "Active", 
    revenue: "1.8B",
    type: "Standard" 
  },
  { 
    id: "S003", 
    name: "Store C (Thu Duc)", 
    address: "789 Kha Van Can, Thu Duc", 
    manager: "Le Van C", 
    phone: "0905678912", 
    status: "Maintenance", 
    revenue: "1.2B",
    type: "Standard" 
  },
];

const STORE_DETAILS = {
  "S001": {
    id: "S001",
    name: "Store A (District 1)",
    info: {
      address: "123 Nguyen Hue, D1, HCMC",
      manager: "Nguyen Van A",
      phone: "0901234567",
      email: "store.a@retailchain.com",
      openedDate: "2020-01-15",
      size: "200m2"
    },
    kpi: {
      dailyRevenue: "85M",
      monthlyRevenue: "2.4B",
      orders: 450,
      avgBasketSize: "185k"
    },
    recentOrders: [
      { id: "ORD001", time: "10:30", total: "250,000", items: 3, status: "Completed" },
      { id: "ORD002", time: "10:45", total: "1,200,000", items: 12, status: "Completed" },
      { id: "ORD003", time: "11:00", total: "560,000", items: 5, status: "Processing" }
    ],
    lowStock: [
      { id: "P005", name: "Product X", stock: 5, min: 10 },
      { id: "P008", name: "Product Y", stock: 2, min: 15 }
    ]
  }
  // Add other stores as needed or fallback to default
};

const storeService = {
  getAllStores: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return STORES;
  },

  getStoreById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return STORE_DETAILS[id] || { ...STORES[0], id }; // Fallback for demo
  },

  createStore: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newStore = { ...data, id: `S${Date.now()}` };
    console.log("Created store:", newStore);
    return newStore;
  },

  updateStore: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Updated store ${id}:`, data);
    return { id, ...data };
  },

  deleteStore: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Deleted store ${id}`);
    return true;
  }
};

export default storeService;

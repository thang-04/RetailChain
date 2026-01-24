// Mock data for Warehouse Module

const WAREHOUSES = [
  { 
    id: "WH001", 
    name: "Central Warehouse", 
    address: "123 Industrial Park, Dist 9, HCMC", 
    capacity: "5000m2", 
    manager: "Tran Van Kho", 
    status: "Active",
    type: "Central",
    utilization: 85
  },
  { 
    id: "WH002", 
    name: "North Regional Hub", 
    address: "456 Hanoi Highway, Hanoi", 
    capacity: "3000m2", 
    manager: "Le Thi Kho", 
    status: "Active",
    type: "Regional",
    utilization: 60
  },
  { 
    id: "WH003", 
    name: "South Hub", 
    address: "789 Long Hau, Long An", 
    capacity: "2500m2", 
    manager: "Nguyen Van Kho", 
    status: "Maintenance",
    type: "Regional",
    utilization: 45
  },
];

const WAREHOUSE_DETAILS = {
  "WH001": {
    id: "WH001",
    name: "Central Warehouse",
    info: {
      address: "123 Industrial Park, Dist 9, HCMC", 
      capacity: "5000m2", 
      manager: "Tran Van Kho", 
      phone: "0909123456",
      email: "wh.central@retailchain.com",
      established: "2018-05-20"
    },
    metrics: {
      totalItems: "150,000",
      totalValue: "45B",
      inboundDaily: "5000 items",
      outboundDaily: "4800 items"
    },
    recentActivity: [
      { id: "ACT001", type: "Inbound", ref: "PO-1023", items: 500, time: "08:30" },
      { id: "ACT002", type: "Outbound", ref: "DO-5678", items: 200, time: "09:15" },
      { id: "ACT003", type: "Audit", ref: "AUD-001", status: "Completed", time: "10:00" }
    ],
    inventory: [
      { id: "P001", name: "Fresh Milk 1L", stock: 5000, bin: "A-01-01" },
      { id: "P002", name: "Orange Juice", stock: 2500, bin: "A-01-02" },
      { id: "P004", name: "Shampoo 500ml", stock: 1200, bin: "B-02-05" }
    ]
  }
};

const warehouseService = {
  getAllWarehouses: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return WAREHOUSES;
  },

  getWarehouseById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return WAREHOUSE_DETAILS[id] || { ...WAREHOUSES[0], id };
  },

  getWarehouseInventory: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return WAREHOUSE_DETAILS["WH001"].inventory;
  },

  createWarehouse: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newWarehouse = { ...data, id: `WH${Date.now()}` };
    console.log("Created warehouse:", newWarehouse);
    return newWarehouse;
  },

  updateWarehouse: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Updated warehouse ${id}:`, data);
    return { id, ...data };
  }
};

export default warehouseService;

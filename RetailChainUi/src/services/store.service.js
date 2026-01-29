import { axiosPublic } from './api/axiosClient';

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
    ],
    staff: [
        {
            id: 1,
            name: "Sarah Jenkins",
            email: "sarah.j@store-a.retail.com",
            role: "Store Manager",
            status: "Active",
            statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
            dotColor: "bg-emerald-500",
            lastShift: "Today, 8:00 AM",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl32EiV1Cebqa_bpYzpzkBbcGFF7jsfVvdcyGwELL3icwWL-bHEY-vvjlZBbETn4yJHLTd0mlZXULn9VYSftCxIumz9g1Z3s0pn9NbvAs-hhuNAsMgLofsRR0c-xOqf9R0fl4859vT99WzRr1SU1h6x2Gr7sxYqB0xF5V3IZN82iDIJdT1PnC6AxYh1gGxRtIV76JI88pmokhGKX-nU3eYiDxkyoySRf69bFEOg1zjo1IfH0wkaDFX5TAdhicbGk3JxKDW05TpnF4"
        },
        {
            id: 2,
            name: "Michael Ross",
            email: "michael.r@store-a.retail.com",
            role: "Sales Associate",
            status: "On Leave",
            statusColor: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",
            dotColor: "bg-amber-500",
            lastShift: "Oct 24, 2023",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxsnr80ZOP5BAXuopRtLfnFvy2BwFVog_oaGAB4sijHA1C240nQhUVSCIU9ace3HuxY6cHdLO517wFQd1-M9ZBm-NTF9AijCkEKy9UwM7i3tuSShQw8Pt-53kppn0mlQ-17VKWEylWVoGL4pKg6TenTZP-H4m_F4XfLyvq0wyIm4mZN8FqZXlE2gw7FGUecyvOK-f0sPlQkASNF8sEYbPI8x8gYaV3QKg5sYKtnRliN3wdqV_7bFuRSUax-f10i2rhiBqkZbKbS_w"
        },
        {
            id: 3,
            name: "David Chen",
            email: "david.c@store-a.retail.com",
            role: "Inventory Spec.",
            status: "Active",
            statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
            dotColor: "bg-emerald-500",
            lastShift: "Yesterday, 2:00 PM",
            initials: "DC",
            initialsColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        },
        {
            id: 4,
            name: "Jessica Wu",
            email: "jessica.w@store-a.retail.com",
            role: "Cashier",
            status: "Inactive",
            statusColor: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30",
            dotColor: "bg-rose-500",
            lastShift: "Sep 12, 2023",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Je__x0w0579S6bdFyCxgWqs1O9N3OiJB1H_cwTsimUeF80bsDKFAbh3RUtyQxpRh8rbKkWsh7Tz23SzHcpyakloL99M_mQtjO8nvmi4p0W5R6yCXJ8u4rmFVMg4uCu2x8mfh6o8rGnZmHJ38PMudqQVD4ywzZKw5-XRKhfFHAIr0Zg-JB7b6K6XpMaMNFlC3eH6Y5L0f_FX1tclo3v1YFAGYOM_nu2UsVCS4HZTWyVgPYU1ZFlEXcrJT_IXoTZ-WiqSQmfbD96A"
        },
        {
            id: 5,
            name: "Marcus Johnson",
            email: "marcus.j@store-a.retail.com",
            role: "Stock Associate",
            status: "Active",
            statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
            dotColor: "bg-emerald-500",
            lastShift: "Today, 9:30 AM",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALp4ud2mAvItBjmZoYNVHXiJsmxBPDi6Q1n0_7AyVGd7FjUbVk9kTmaZ1k4aCEaICcwLFI_5_gPAqeqYEyLIFk6ZOEjwOMPmvIXMt-I0z9MSb395yl3T5BayN-LTn37glIKvWiDx_D83Tfq7DzYz5qu88nLdI0VvyvakWaW4fWkBWAAcGTtcGS1JzpXhwVweMm5c6gp8xS6HnqOYiHDHLkjFozn3xgR7keKseDcXFnZBXrSjqJfPGCeV7m6iY6_yHzKNyHpixn7qg"
        }
    ]
  }
  // Add other stores as needed or fallback to default
};

const storeService = {
  getAllStores: async () => {
    try {
      const response = await axiosPublic.get('/api/stores');
      if (response && response.data) {
        return response.data.map(store => ({
          id: store.code,
          name: store.name,
          address: store.address,
          manager: store.manager || "N/A",
          phone: store.phone || "N/A",
          status: store.status || "Active",
          revenue: store.revenue || "N/A",
          type: store.type || "Standard"
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  getStoreById: async (slug) => {
    try {
      const response = await axiosPublic.get(`/api/stores/${slug}`);
      if (response && response.data) {
        const storeData = response.data;

        return {
          id: storeData.code,
          name: storeData.name,
          address: storeData.address,
          manager: storeData.manager || "N/A",
          phone: storeData.phone || "N/A",
          email: storeData.email || "N/A",
          openedDate: storeData.openedDate || "N/A",
          size: storeData.size || "N/A",
          type: storeData.type || "Standard",
          status: storeData.status || "Active",
          kpi: storeData.kpi || {
            dailyRevenue: "0",
            monthlyRevenue: "0",
            orders: 0,
            avgBasketSize: "0"
          },
          inventory: storeData.inventory || [],
          staff: storeData.staff || [],
          recentOrders: storeData.recentOrders || [],
          lowStock: storeData.lowStock || []
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching store detail:', error);
      throw error;
    }
  },

  createStore: async (data) => {
    try {
      const requestData = {
        code: data.code,
        name: data.name,
        address: data.address
      };
      
      const response = await axiosPublic.post('/api/stores', requestData);
      if (response && response.data) {
        const newStore = response.data;
        return {
          id: newStore.code,
          name: newStore.name,
          address: newStore.address,
          manager: newStore.manager || "N/A",
          phone: newStore.phone || "N/A",
          status: newStore.status || "Active",
          revenue: newStore.revenue || "N/A",
          type: newStore.type || "Standard"
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  getStoreStaff: async (storeId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const store = STORE_DETAILS[storeId] || STORE_DETAILS["S001"];
    return store.staff || [];
  },

  updateStore: async (id, data) => {
    try {
      const statusMap = {
        'Active': 1,
        'Inactive': 0,
        'Maintenance': 0 
      };

      const requestData = {
        name: data.name,
        address: data.address,
        status: statusMap[data.status] ?? 1
      };

      const response = await axiosPublic.put(`/api/stores/${id}`, requestData);
      return response?.data || response;
    } catch (error) {
      console.error(`Error updating store ${id}:`, error);
      throw error;
    }
  },

  deleteStore: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Deleted store ${id}`);
    return true;
  }
};

export default storeService;

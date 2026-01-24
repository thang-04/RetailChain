// Mock data for Dashboard & Executive Report

const KPI_DATA = [
  { title: "Total Revenue", value: "24.5B", change: "+12.5%", trend: "up" },
  { title: "Total Orders", value: "15,234", change: "+8.2%", trend: "up" },
  { title: "Active Stores", value: "45", change: "+2", trend: "up" },
  { title: "Inventory Value", value: "12.8B", change: "-2.4%", trend: "down" },
];

const REVENUE_DATA = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

const STORE_RANKING = [
  { id: 1, name: "Store A (District 1)", revenue: "2.4B", growth: "+15%" },
  { id: 2, name: "Store B (District 3)", revenue: "1.8B", growth: "+8%" },
  { id: 3, name: "Store C (Thu Duc)", revenue: "1.2B", growth: "-5%" },
  { id: 4, name: "Store D (Go Vap)", revenue: "900M", growth: "+2%" },
  { id: 5, name: "Store E (Tan Binh)", revenue: "850M", growth: "+10%" },
];

const EXECUTIVE_REPORT_DATA = {
  overview: {
    totalRevenue: "150.5B",
    totalProfit: "35.2B",
    totalCosts: "115.3B",
    yoyGrowth: "18.5%"
  },
  regionalPerformance: [
    { region: "Ho Chi Minh City", revenue: "85B", stores: 25 },
    { region: "Hanoi", revenue: "45B", stores: 15 },
    { region: "Da Nang", revenue: "20.5B", stores: 5 }
  ],
  categoryPerformance: [
    { category: "Electronics", share: "45%", growth: "+12%" },
    { category: "Fashion", share: "30%", growth: "+5%" },
    { category: "Groceries", share: "25%", growth: "+8%" }
  ]
};

const dashboardService = {
  getKPIData: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return KPI_DATA;
  },

  getRevenueData: async (timeRange = 'monthly') => {
    await new Promise(resolve => setTimeout(resolve, 600));
    // In a real app, use timeRange to filter/aggregate data
    return REVENUE_DATA;
  },

  getStoreRanking: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return STORE_RANKING;
  },

  getExecutiveReport: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return EXECUTIVE_REPORT_DATA;
  }
};

export default dashboardService;

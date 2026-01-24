
// Mock data for staff
const MOCK_STAFF = [
  {
    id: "ST001",
    name: "Nguyen Van A",
    role: "Store Manager",
    store: "Store A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST001",
    department: "Management",
    joinDate: "2023-01-15"
  },
  {
    id: "ST002",
    name: "Tran Thi B",
    role: "Sales Associate",
    store: "Store A",
    email: "tranthib@example.com",
    phone: "0901234568",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST002",
    department: "Sales",
    joinDate: "2023-02-20"
  },
  {
    id: "ST003",
    name: "Le Van C",
    role: "Inventory Specialist",
    store: "Store B",
    email: "levanc@example.com",
    phone: "0901234569",
    status: "On Leave",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST003",
    department: "Warehouse",
    joinDate: "2023-03-10"
  },
  {
    id: "ST004",
    name: "Pham Thi D",
    role: "Cashier",
    store: "Store A",
    email: "phamthid@example.com",
    phone: "0901234570",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST004",
    department: "Sales",
    joinDate: "2023-04-05"
  },
  {
    id: "ST005",
    name: "Hoang Van E",
    role: "Security",
    store: "Store C",
    email: "hoangvane@example.com",
    phone: "0901234571",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST005",
    department: "Security",
    joinDate: "2023-05-12"
  }
];

const MOCK_SHIFTS = [
  {
    id: "SH001",
    staffId: "ST002",
    date: "2024-01-25",
    shift: "Morning (8:00 - 16:00)",
    store: "Store A",
    status: "Scheduled"
  },
  {
    id: "SH002",
    staffId: "ST004",
    date: "2024-01-25",
    shift: "Afternoon (14:00 - 22:00)",
    store: "Store A",
    status: "Scheduled"
  },
  {
    id: "SH003",
    staffId: "ST001",
    date: "2024-01-25",
    shift: "Admin (9:00 - 17:00)",
    store: "Store A",
    status: "Scheduled"
  }
];

const staffService = {
  getAllStaff: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_STAFF];
  },

  getStaffById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_STAFF.find(s => s.id === id);
  },

  getShifts: async (date) => { // eslint-disable-line no-unused-vars
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_SHIFTS]; // In real app, filter by date
  },
  
  updateStaff: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Updated staff ${id}`, data);
    return { ...MOCK_STAFF.find(s => s.id === id), ...data };
  },

  addStaff: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newStaff = { ...data, id: `ST${Date.now()}` };
      console.log('Added staff', newStaff);
      return newStaff;
  }
};

export default staffService;

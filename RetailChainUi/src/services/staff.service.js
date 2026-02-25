import { axiosPrivate } from './api/axiosClient';

// Mock data fallback
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
  }
];

const staffService = {
  /**
   * Lấy danh sách nhân viên của một cửa hàng
   * GET /api/stores/{storeId}/staff
   * @param {number|string} storeId - ID của cửa hàng
   * @returns {Promise<Array>} Danh sách nhân viên
   */
  getStaffByStoreId: async (storeId) => {
    try {
      const response = await axiosPrivate.get(`/stores/${storeId}/staff`);
      if (response && response.data) {
        return response.data.map(staff => ({
          id: staff.id,
          username: staff.username,
          fullName: staff.fullName,
          name: staff.fullName || staff.username,
          email: staff.email,
          phone: staff.phone,
          status: staff.status === 1 ? 'Active' : 'Inactive',
          role: staff.roleName || 'Staff',
          roleName: staff.roleName || 'Staff',
          createdAt: staff.createdAt
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching staff by store:', error);
      // Fallback to empty array
      return [];
    }
  },

  getAllStaff: async () => {
    // For now, return empty - needs backend endpoint
    return [];
  },

  getStaffById: async (id) => {
    // For now, return null - needs backend endpoint
    return null;
  },

  getShifts: async (date) => {
    // TODO: Implement when Shift API is available
    return [];
  },
  
  updateStaff: async (id, data) => {
    // TODO: Implement when backend has update staff endpoint
    console.log(`Updated staff ${id}`, data);
    throw new Error("Not implemented");
  },

  addStaff: async (data) => {
    // TODO: Implement when backend has create staff endpoint
    console.log('Add staff', data);
    throw new Error("Not implemented");
  }
};

export default staffService;

import { axiosPublic, axiosPrivate } from './api/axiosClient';

const storeService = {
  getAllStores: async () => {
    try {
      const response = await axiosPublic.get('/stores');
      if (response && response.data) {
        return response.data.map(store => ({
          id: store.code,
          dbId: store.id,
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
      const response = await axiosPublic.get(`/stores/${slug}`);
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
          warehouseId: storeData.warehouseId || "",
          kpi: storeData.kpi || {
            totalProductVariants: 0,
            totalStockQuantity: 0,
            lowStockCount: 0,
            activeStaff: 0
          },
          inventory: storeData.inventory || [],
          staff: storeData.staff || [],
          revenueData: storeData.revenueData || [],
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
        address: data.address,
        warehouseId: data.warehouseId ? parseInt(data.warehouseId) : null
      };

      const response = await axiosPrivate.post('/stores', requestData);
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
    // Note: This endpoint needs verification on the backend
    return axiosPublic.get('/stores/' + storeId + '/staff').then(res => res.data);
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
        status: statusMap[data.status] ?? 1,
        warehouseId: data.warehouseId ? parseInt(data.warehouseId) : null
      };

      const response = await axiosPrivate.put(`/stores/${id}`, requestData);
      return response?.data || response;
    } catch (error) {
      console.error(`Error updating store ${id}:`, error);
      throw error;
    }
  },

  deleteStore: async (id) => {
    return axiosPrivate.delete('/stores/' + id);
  }
};

export default storeService;


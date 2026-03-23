import { axiosPrivate } from "./api/axiosClient";

const staffQuotaService = {
  getByStore: async (storeId) => {
    const response = await axiosPrivate.get("/staff-quotas", { params: { storeId } });
    return response;
  },

  /**
   * @param {Array<{userId:number, storeId:number, minShiftsPerWeek:number, maxShiftsPerWeek:number}>} items
   */
  upsertMany: async (items) => {
    const response = await axiosPrivate.put("/staff-quotas", items);
    return response;
  },
};

export default staffQuotaService;


import { axiosPrivate } from "./api/axiosClient";

const dashboardService = {
  getSummary: async (timeRange = "30days") => {
    const response = await axiosPrivate.get("/dashboard/summary", {
      params: { timeRange },
    });
    return response?.data || null;
  },
};

export default dashboardService;

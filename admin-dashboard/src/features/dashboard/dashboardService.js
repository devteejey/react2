
import api from "../../api/axios";

const getDashboardData = async (period = "month") => {
  const response = await api.get("/dashboard", {
    params: { period },
  });

  return response.data.dashboard || response.data;
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;

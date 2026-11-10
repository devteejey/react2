
import api from "../../api/axios";

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  // Expected backend response: { token, user }
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  login,
  getCurrentUser,
  logout,
};

export default authService;

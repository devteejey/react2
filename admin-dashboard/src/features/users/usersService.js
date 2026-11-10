
import api from "../../api/axios";

const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

const updateUser = async ({ userId, userData }) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`);
  return userId;
};

const usersService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

export default usersService;

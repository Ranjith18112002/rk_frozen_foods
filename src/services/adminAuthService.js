import api from "../api/axios";

export const checkAdminExists = async () => {
  const response = await api.get("/admin-profile/check");
  return response.data;
};

export const registerAdmin = async (adminData) => {
  const response = await api.post("/admin-profile/register", adminData);
  return response.data;
};

export const loginAdmin = async (credentials) => {
  const response = await api.post("/admin-profile/login", credentials);
  return response.data;
};

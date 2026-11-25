
import api from "../api/axios";

// Get logged-in admin profile
export const getAdminProfile = async () => {
  const response = await api.get("/admin-profile/");
  return response.data;
};

// Update admin profile
export const updateAdminProfile = async (profileData) => {
  const response = await api.put("/admin-profile/", profileData);
  return response.data;
};


import api from "../api/axios";

// GET Company Settings
export const getCompanySettings = async () => {
  const response = await api.get("/company-settings");
  return response.data;
};

// CREATE Company Settings
export const createCompanySettings = async (data) => {
  const response = await api.post("/company-settings", data);
  return response.data;
};

// UPDATE Company Settings
export const updateCompanySettings = async (data) => {
  const response = await api.put("/company-settings", data);
  return response.data;
};

// DELETE Company Settings
export const deleteCompanySettings = async () => {
  const response = await api.delete("/company-settings");
  return response.data;
};

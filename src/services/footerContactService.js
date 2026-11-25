
import api from "../api/axios";

// GET Footer Settings
export const getFooterContact = async () => {
  const response = await api.get("/footer-settings");
  return response.data;
};

// CREATE Footer Settings
export const createFooterContact = async (data) => {
  const response = await api.post("/footer-settings", data);
  return response.data;
};

// UPDATE Footer Settings
export const updateFooterContact = async (data) => {
  const response = await api.put("/footer-settings", data);
  return response.data;
};

// DELETE Footer Settings
export const deleteFooterContact = async () => {
  const response = await api.delete("/footer-settings");
  return response.data;
};

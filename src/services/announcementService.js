
import api from "../api/axios";

// Get all announcements
export const getAnnouncements = async () => {
  const response = await api.get("/announcements");
  return response.data;
};

// Get active announcements
export const getActiveAnnouncements = async () => {
  const response = await api.get("/announcements/active");
  return response.data;
};

// Get announcement by ID
export const getAnnouncementById = async (id) => {
  const response = await api.get(`/announcements/${id}`);
  return response.data;
};

// Create announcement
export const createAnnouncement = async (formData) => {
  const response = await api.post("/announcements", formData);
  return response.data;
};

// Update announcement
export const updateAnnouncement = async (id, formData) => {
  const response = await api.put(`/announcements/${id}`, formData);
  return response.data;
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

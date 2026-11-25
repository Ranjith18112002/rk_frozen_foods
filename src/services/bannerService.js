
import api from "../api/axios";

// CREATE BANNER
export const createBanner = async (formData) => {
  const response = await api.post("/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET ALL BANNERS
export const getBanners = async () => {
  const response = await api.get("/banners");
  return response.data;
};

// GET SINGLE BANNER
export const getBannerById = async (id) => {
  const response = await api.get(`/banners/${id}`);
  return response.data;
};

// UPDATE BANNER
export const updateBanner = async (id, formData) => {
  const response = await api.put(`/banners/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// DELETE BANNER
export const deleteBanner = async (id) => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};

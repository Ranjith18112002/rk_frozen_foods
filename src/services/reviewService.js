
import api from "../api/axios";

// Get all customer reviews
export const getReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

// Get only approved reviews
export const getApprovedReviews = async () => {
  const response = await api.get("/reviews/approved");
  return response.data;
};

// Get single review by ID
export const getReviewById = async (id) => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

// Create new customer review
export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

// Update review status (Pending / Approved / Rejected)
export const updateReviewStatus = async (id, status) => {
  const response = await api.patch(`/reviews/${id}/status`, {
    status,
  });
  return response.data;
};

// Delete customer review
export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

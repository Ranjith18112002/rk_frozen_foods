
import api from "../api/axios";

// Create Bulk Order
export const createBulkOrder = async (bulkOrderData) => {
  const response = await api.post("/bulk-orders", bulkOrderData);
  return response.data;
};

// Get All Bulk Orders
export const getBulkOrders = async () => {
  const response = await api.get("/bulk-orders");
  return response.data;
};

// Get Single Bulk Order
export const getBulkOrderById = async (id) => {
  const response = await api.get(`/bulk-orders/${id}`);
  return response.data;
};

// Update Bulk Order Status
export const updateBulkOrderStatus = async (id, status) => {
  const response = await api.patch(`/bulk-orders/${id}/status`, {
    status,
  });
  return response.data;
};

// Delete Bulk Order
export const deleteBulkOrder = async (id) => {
  const response = await api.delete(`/bulk-orders/${id}`);
  return response.data;
};

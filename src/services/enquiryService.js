
import api from "../api/axios";

// CREATE CUSTOMER ENQUIRY
export const createEnquiry = async (enquiryData) => {
  const response = await api.post("/enquiries", enquiryData);

  return response.data;
};

// GET ALL ENQUIRIES
export const getEnquiries = async () => {
  const response = await api.get("/enquiries");

  return response.data;
};

// UPDATE ENQUIRY STATUS
export const updateEnquiryStatus = async (id, status) => {
  const response = await api.put(`/enquiries/${id}`, { status });

  return response.data;
};

// DELETE ENQUIRY
export const deleteEnquiry = async (id) => {
  const response = await api.delete(`/enquiries/${id}`);

  return response.data;
};

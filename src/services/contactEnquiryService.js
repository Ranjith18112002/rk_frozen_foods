
import api from "../api/axios";

// Get all contact enquiries
export const getContactEnquiries = async () => {
  const response = await api.get("/contact-enquiries");
  return response.data;
};

// Get single contact enquiry
export const getContactEnquiryById = async (id) => {
  const response = await api.get(`/contact-enquiries/${id}`);
  return response.data;
};

// Update contact enquiry status
export const updateContactEnquiryStatus = async (id, status) => {
  const response = await api.patch(
    `/contact-enquiries/${id}/status`,
    { status }
  );
  return response.data;
};

// Delete contact enquiry
export const deleteContactEnquiry = async (id) => {
  const response = await api.delete(`/contact-enquiries/${id}`);
  return response.data;
};

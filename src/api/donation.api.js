import API from "./axios";

export const getPendingRequests = () => API.get("/pending-requests");
export const getMyRequests = () => API.get("/my-donation-requests");
export const createDonationRequest = (data) =>
  API.post("/donation-requests", data);
export const updateDonationStatus = (id, status) =>
  API.patch(`/donation-requests/status/${id}`, { status });

import { apiGet, apiSend } from "./client";

export function listVenues() {
  return apiGet("/api/venues");
}

export function createVenue(payload) {
  return apiSend("/api/venues", "POST", payload);
}

export function updateVenue(id, payload) {
  return apiSend(`/api/venues/${id}`, "PUT", payload);
}

export function deleteVenue(id) {
  return apiSend(`/api/venues/${id}`, "DELETE");
}

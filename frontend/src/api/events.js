import { apiGet, apiSend } from "./client";

export function listEvents() {
  return apiGet("/api/events");
}

export function createEvent(payload) {
  return apiSend("/api/events", "POST", payload);
}

export function updateEvent(id, payload) {
  return apiSend(`/api/events/${id}`, "PUT", payload);
}

export function deleteEvent(id) {
  return apiSend(`/api/events/${id}`, "DELETE");
}

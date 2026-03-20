import { apiGet, apiSend } from "./client";

export function listOrders() {
  return apiGet("/api/orders");
}

export function createOrder(payload) {
  return apiSend("/api/orders", "POST", payload);
}

export function getOrder(id) {
  return apiGet(`/api/orders/${id}`);
}

import { apiGet, apiSend } from "./client";

export function listCustomers() {
  return apiGet("/api/customers");
}

export function createCustomer(payload) {
  return apiSend("/api/customers", "POST", payload);
}

export function updateCustomer(id, payload) {
  return apiSend(`/api/customers/${id}`, "PUT", payload);
}

export function deleteCustomer(id) {
  return apiSend(`/api/customers/${id}`, "DELETE");
}

export function getCurrentCustomer() {
  return apiGet("/api/customers/me");
}

export function registerCustomer(payload) {
  return apiSend("/api/customers/register", "POST", payload);
}

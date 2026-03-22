import { useCallback, useState } from "react";
import { listCustomers } from "../api/customers";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState("");
  const [customerPage, setCustomerPage] = useState(1);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });
  const [customerEditingId, setCustomerEditingId] = useState(null);

  const loadCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true);
      setCustomersError("");
      const data = await listCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setCustomersError(err?.message || "Unable to load customers.");
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  const resetCustomerForm = useCallback(() => {
    setCustomerForm({ name: "", email: "", address: "", phoneNumber: "" });
    setCustomerEditingId(null);
  }, []);

  return {
    customers,
    customersLoading,
    customersError,
    customerPage,
    setCustomerPage,
    customerForm,
    setCustomerForm,
    customerEditingId,
    setCustomerEditingId,
    loadCustomers,
    resetCustomerForm,
  };
}

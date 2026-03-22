import { useCallback, useState } from "react";
import { listOrders } from "../api/orders";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [orderForm, setOrderForm] = useState({
    customerId: "",
    eventId: "",
    quantity: "",
  });

  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");
      const data = await listOrders();
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      return list;
    } catch (err) {
      setOrdersError(err?.message || "Unable to load orders.");
      setOrders([]);
      return [];
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const resetOrderForm = useCallback(() => {
    setOrderForm({ customerId: "", eventId: "", quantity: "" });
  }, []);

  return {
    orders,
    ordersLoading,
    ordersError,
    orderPage,
    setOrderPage,
    orderForm,
    setOrderForm,
    loadOrders,
    resetOrderForm,
  };
}

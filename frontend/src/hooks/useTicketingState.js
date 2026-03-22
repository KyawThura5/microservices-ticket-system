import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../api/customers";
import { createEvent, deleteEvent, updateEvent } from "../api/events";
import { createVenue, deleteVenue, updateVenue } from "../api/venues";
import { createOrder, getOrder } from "../api/orders";
import useCustomers from "./useCustomers";
import useEvents from "./useEvents";
import useVenues from "./useVenues";
import useOrders from "./useOrders";
import { numberOrNull } from "../utils/format";

export default function useTicketingState() {
  const {
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
  } = useCustomers();

  const {
    events,
    eventsLoading,
    eventsError,
    eventPage,
    setEventPage,
    eventForm,
    setEventForm,
    eventEditingId,
    setEventEditingId,
    loadEvents,
    resetEventForm,
  } = useEvents();

  const {
    venues,
    venuesLoading,
    venuesError,
    venuePage,
    setVenuePage,
    venueForm,
    setVenueForm,
    venueEditingId,
    setVenueEditingId,
    loadVenues,
    resetVenueForm,
  } = useVenues();

  const {
    orders,
    ordersLoading,
    ordersError,
    orderPage,
    setOrderPage,
    orderForm,
    setOrderForm,
    loadOrders,
    resetOrderForm,
  } = useOrders();

  const [actionMessage, setActionMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const pollRef = useRef(null);
  const pollTimeoutRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ type: "", id: null, label: "" });

  useEffect(() => {
    loadCustomers();
    loadEvents();
    loadVenues();
    loadOrders();

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [loadCustomers, loadEvents, loadVenues, loadOrders]);

  const stats = useMemo(
    () => [
      { label: "Customers", value: customers.length, hint: "Registered" },
      { label: "Events", value: events.length, hint: "Scheduled" },
      { label: "Venues", value: venues.length, hint: "Managed" },
      { label: "Orders", value: orders.length, hint: "Total" },
    ],
    [customers.length, events.length, venues.length, orders.length]
  );

  const venueMap = useMemo(() => {
    const map = new Map();
    venues.forEach((venue) => {
      map.set(venue.id, venue);
    });
    return map;
  }, [venues]);

  const customerMap = useMemo(() => {
    const map = new Map();
    customers.forEach((customer) => {
      map.set(customer.id, customer);
    });
    return map;
  }, [customers]);

  const eventMap = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      map.set(event.id, event);
    });
    return map;
  }, [events]);

  const orderStatusCounts = useMemo(() => {
    const counts = { PENDING: 0, CONFIRMED: 0, REJECTED: 0 };
    orders.forEach((order) => {
      if (order.orderStatus === "CONFIRMED") counts.CONFIRMED += 1;
      else if (order.orderStatus === "REJECTED") counts.REJECTED += 1;
      else counts.PENDING += 1;
    });
    return counts;
  }, [orders]);

  const handleFormChange = useCallback(
    (setter) => (event) => {
      const { name, value } = event.target;
      setter((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const openModal = useCallback(
    (type, mode, data = null) => {
      setModalType(type);
      setModalMode(mode);
      setModalOpen(true);
      if (type === "customer") {
        if (mode === "edit" && data) {
          setCustomerEditingId(data.id);
          setCustomerForm({
            name: data.name || "",
            email: data.email || "",
            address: data.address || "",
            phoneNumber: data.phoneNumber || "",
          });
        } else {
          resetCustomerForm();
        }
      }
      if (type === "event") {
        if (mode === "edit" && data) {
          setEventEditingId(data.id);
          setEventForm({
            name: data.name || "",
            venueId: data.venueId || "",
            totalCapacity: data.totalCapacity || "",
            ticketPrice: data.ticketPrice || "",
          });
        } else {
          resetEventForm();
        }
      }
      if (type === "venue") {
        if (mode === "edit" && data) {
          setVenueEditingId(data.id);
          setVenueForm({
            name: data.name || "",
            address: data.address || "",
            totalCapacity: data.totalCapacity || "",
          });
        } else {
          resetVenueForm();
        }
      }
      if (type === "order") {
        resetOrderForm();
      }
    },
    [resetCustomerForm, resetEventForm, resetVenueForm, resetOrderForm]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType("");
    setModalMode("create");
  }, []);

  const openConfirm = useCallback((type, id, label) => {
    setConfirmTarget({ type, id, label });
    setConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTarget({ type: "", id: null, label: "" });
  }, []);

  const handleCustomerSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      setActionMessage("");
      try {
        if (customerEditingId) {
          await updateCustomer(customerEditingId, customerForm);
          setActionMessage("Customer updated.");
        } else {
          await createCustomer(customerForm);
          setActionMessage("Customer created.");
        }
        resetCustomerForm();
        await loadCustomers();
        closeModal();
        setCustomerPage(1);
      } catch (err) {
        setActionMessage(err?.message || "Unable to save customer.");
      } finally {
        setSaving(false);
      }
    },
    [customerEditingId, customerForm, closeModal, loadCustomers, resetCustomerForm]
  );

  const handleEventSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      setActionMessage("");
      const payload = {
        name: eventForm.name,
        venueId: numberOrNull(eventForm.venueId),
        totalCapacity: numberOrNull(eventForm.totalCapacity),
        ticketPrice: numberOrNull(eventForm.ticketPrice),
      };
      try {
        if (eventEditingId) {
          await updateEvent(eventEditingId, payload);
          setActionMessage("Event updated.");
        } else {
          await createEvent(payload);
          setActionMessage("Event created.");
        }
        resetEventForm();
        await loadEvents();
        closeModal();
        setEventPage(1);
      } catch (err) {
        setActionMessage(err?.message || "Unable to save event.");
      } finally {
        setSaving(false);
      }
    },
    [eventEditingId, eventForm, closeModal, loadEvents, resetEventForm]
  );

  const handleVenueSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      setActionMessage("");
      const payload = {
        name: venueForm.name,
        address: venueForm.address,
        totalCapacity: numberOrNull(venueForm.totalCapacity),
      };
      try {
        if (venueEditingId) {
          await updateVenue(venueEditingId, payload);
          setActionMessage("Venue updated.");
        } else {
          await createVenue(payload);
          setActionMessage("Venue created.");
        }
        resetVenueForm();
        await loadVenues();
        closeModal();
        setVenuePage(1);
      } catch (err) {
        setActionMessage(err?.message || "Unable to save venue.");
      } finally {
        setSaving(false);
      }
    },
    [venueEditingId, venueForm, closeModal, loadVenues, resetVenueForm]
  );

  const startOrderPolling = useCallback(
    (orderId) => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }

      pollRef.current = setInterval(async () => {
        try {
          const latest = await getOrder(orderId);
          if (!latest) return;
          if (latest.orderStatus && latest.orderStatus !== "PENDING") {
            const reason = latest.failureReason ? ` (${latest.failureReason})` : "";
            setActionMessage(`Order #${orderId} ${latest.orderStatus.toLowerCase()}${reason}.`);
            await loadOrders();
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } catch (err) {
          setActionMessage(err?.message || "Unable to refresh order status.");
        }
      }, 3000);

      pollTimeoutRef.current = setTimeout(() => {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        setActionMessage(`Order #${orderId} still pending. Refresh to check again.`);
      }, 30000);
    },
    [loadOrders]
  );

  const findLatestOrder = useCallback((list, customerId, eventId) => {
    const filtered = list.filter(
      (order) =>
        (customerId ? Number(order.customerId) === Number(customerId) : true) &&
        (eventId ? Number(order.eventId) === Number(eventId) : true)
    );
    if (filtered.length === 0) return null;
    return filtered.reduce((latest, current) => {
      const latestTime = latest.placedAt ? Date.parse(latest.placedAt) : 0;
      const currentTime = current.placedAt ? Date.parse(current.placedAt) : 0;
      return currentTime >= latestTime ? current : latest;
    });
  }, []);

  const handleOrderSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      setActionMessage("");
      const requestedQty = numberOrNull(orderForm.quantity);
      const payload = {
        customerId: numberOrNull(orderForm.customerId),
        eventId: numberOrNull(orderForm.eventId),
        quantity: requestedQty,
      };
      try {
        const created = await createOrder(payload);
        setActionMessage("Order placed. Waiting for status...");
        resetOrderForm();
        await loadOrders();
        closeModal();
        setOrderPage(1);
        if (created?.id) {
          startOrderPolling(created.id);
        }
      } catch (err) {
        setActionMessage(err?.message || "Unable to place order.");
        const latestOrders = await loadOrders();
        const fallback = findLatestOrder(latestOrders, payload.customerId, payload.eventId);
        if (fallback?.id && fallback.orderStatus === "PENDING") {
          startOrderPolling(fallback.id);
        }
      } finally {
        setSaving(false);
      }
    },
    [orderForm, closeModal, loadOrders, resetOrderForm, startOrderPolling, findLatestOrder]
  );

  const handleDeleteCustomer = useCallback(
    async (id) => {
      setSaving(true);
      setActionMessage("");
      try {
        await deleteCustomer(id);
        setActionMessage("Customer deleted.");
        await loadCustomers();
        setCustomerPage(1);
      } catch (err) {
        setActionMessage(err?.message || "Unable to delete customer.");
      } finally {
        setSaving(false);
      }
    },
    [loadCustomers]
  );

  const handleDeleteEvent = useCallback(
    async (id) => {
      setSaving(true);
      setActionMessage("");
      try {
        await deleteEvent(id);
        setActionMessage("Event deleted.");
        await loadEvents();
        setEventPage(1);
      } catch (err) {
        setActionMessage(err?.message || "Unable to delete event.");
      } finally {
        setSaving(false);
      }
    },
    [loadEvents]
  );

  const handleDeleteVenue = useCallback(
    async (id) => {
      setSaving(true);
      setActionMessage("");
      try {
        await deleteVenue(id);
        setActionMessage("Venue deleted.");
        await loadVenues();
        setVenuePage(1);
      } catch (err) {
        setActionMessage(err?.message || "Unable to delete venue.");
      } finally {
        setSaving(false);
      }
    },
    [loadVenues]
  );

  const confirmDelete = useCallback(async () => {
    if (!confirmTarget.id) return;
    closeConfirm();
    if (confirmTarget.type === "customer") {
      await handleDeleteCustomer(confirmTarget.id);
    }
    if (confirmTarget.type === "event") {
      await handleDeleteEvent(confirmTarget.id);
    }
    if (confirmTarget.type === "venue") {
      await handleDeleteVenue(confirmTarget.id);
    }
  }, [closeConfirm, confirmTarget, handleDeleteCustomer, handleDeleteEvent, handleDeleteVenue]);


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
    events,
    eventsLoading,
    eventsError,
    eventPage,
    setEventPage,
    eventForm,
    setEventForm,
    eventEditingId,
    setEventEditingId,
    venues,
    venuesLoading,
    venuesError,
    venuePage,
    setVenuePage,
    venueForm,
    setVenueForm,
    venueEditingId,
    setVenueEditingId,
    orders,
    ordersLoading,
    ordersError,
    orderPage,
    setOrderPage,
    orderForm,
    setOrderForm,
    actionMessage,
    saving,
    modalOpen,
    modalType,
    modalMode,
    confirmOpen,
    confirmTarget,
    stats,
    venueMap,
    customerMap,
    eventMap,
    orderStatusCounts,
    loadOrders,
    openModal,
    closeModal,
    openConfirm,
    closeConfirm,
    confirmDelete,
    handleFormChange,
    handleCustomerSubmit,
    handleEventSubmit,
    handleVenueSubmit,
    handleOrderSubmit,
  };
}

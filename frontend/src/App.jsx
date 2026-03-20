import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Modal from "./components/Modal";
import ConfirmModal from "./components/ConfirmModal";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Orders from "./pages/Orders";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from "./api/customers";
import { createEvent, deleteEvent, listEvents, updateEvent } from "./api/events";
import { createVenue, deleteVenue, listVenues, updateVenue } from "./api/venues";
import { createOrder, getOrder, listOrders } from "./api/orders";
import { numberOrNull } from "./utils/format";

const sections = [
  { id: "dashboard", label: "Dashboard", hint: "Overview & activity" },
  { id: "customers", label: "Customers", hint: "Profiles & outreach" },
  { id: "events", label: "Events", hint: "Lineup & pricing" },
  { id: "venues", label: "Venues", hint: "Capacity & locations" },
  { id: "orders", label: "Orders", hint: "Saga status" },
];

function App() {
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pageSize = 6;

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

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [eventPage, setEventPage] = useState(1);
  const [eventForm, setEventForm] = useState({
    name: "",
    venueId: "",
    totalCapacity: "",
    ticketPrice: "",
  });
  const [eventEditingId, setEventEditingId] = useState(null);

  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState("");
  const [venuePage, setVenuePage] = useState(1);
  const [venueForm, setVenueForm] = useState({
    name: "",
    address: "",
    totalCapacity: "",
  });
  const [venueEditingId, setVenueEditingId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [orderForm, setOrderForm] = useState({
    customerId: "",
    eventId: "",
    quantity: "",
  });

  const [actionMessage, setActionMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const pollRef = useRef(null);
  const pollTimeoutRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ type: "", id: null, label: "" });

  async function loadCustomers() {
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
  }

  async function loadEvents() {
    try {
      setEventsLoading(true);
      setEventsError("");
      const data = await listEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setEventsError(err?.message || "Unable to load events.");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  async function loadVenues() {
    try {
      setVenuesLoading(true);
      setVenuesError("");
      const data = await listVenues();
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      setVenuesError(err?.message || "Unable to load venues.");
      setVenues([]);
    } finally {
      setVenuesLoading(false);
    }
  }

  async function loadOrders() {
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
  }

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
  }, []);

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

  const orderStatusCounts = useMemo(() => {
    const counts = { PENDING: 0, CONFIRMED: 0, REJECTED: 0 };
    orders.forEach((order) => {
      if (order.orderStatus === "CONFIRMED") counts.CONFIRMED += 1;
      else if (order.orderStatus === "REJECTED") counts.REJECTED += 1;
      else counts.PENDING += 1;
    });
    return counts;
  }, [orders]);

  function handleFormChange(setter) {
    return (event) => {
      const { name, value } = event.target;
      setter((prev) => ({ ...prev, [name]: value }));
    };
  }

  function resetCustomerForm() {
    setCustomerForm({ name: "", email: "", address: "", phoneNumber: "" });
    setCustomerEditingId(null);
  }

  function resetEventForm() {
    setEventForm({ name: "", venueId: "", totalCapacity: "", ticketPrice: "" });
    setEventEditingId(null);
  }

  function resetVenueForm() {
    setVenueForm({ name: "", address: "", totalCapacity: "" });
    setVenueEditingId(null);
  }

  function resetOrderForm() {
    setOrderForm({ customerId: "", eventId: "", quantity: "" });
  }

  function openModal(type, mode, data = null) {
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
  }

  function closeModal() {
    setModalOpen(false);
    setModalType("");
    setModalMode("create");
  }

  function openConfirm(type, id, label) {
    setConfirmTarget({ type, id, label });
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setConfirmTarget({ type: "", id: null, label: "" });
  }

  async function handleCustomerSubmit(event) {
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
  }

  async function handleEventSubmit(event) {
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
  }

  async function handleVenueSubmit(event) {
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
  }

  async function handleOrderSubmit(event) {
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
  }

  async function handleDeleteCustomer(id) {
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
  }

  async function handleDeleteEvent(id) {
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
  }

  async function handleDeleteVenue(id) {
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
  }

  async function confirmDelete() {
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
  }

  function startOrderPolling(orderId) {
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
  }

  function findLatestOrder(list, customerId, eventId) {
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
  }

  return (
    <div className={`app ${sidebarCollapsed ? "is-collapsed" : ""}`} data-theme={theme}>
      <Sidebar
        sections={sections}
        active={active}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        onSelect={setActive}
      />

      <main className="content">
        <Header
          title={sections.find((section) => section.id === active)?.label}
          saving={saving}
          actionMessage={actionMessage}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        />

        {active === "dashboard" ? (
          <Dashboard
            stats={stats}
            ordersLoading={ordersLoading}
            ordersError={ordersError}
            orders={orders}
            orderStatusCounts={orderStatusCounts}
            eventsLoading={eventsLoading}
            eventsError={eventsError}
            events={events}
          />
        ) : null}

        {active === "customers" ? (
          <Customers
            customers={customers}
            loading={customersLoading}
            error={customersError}
            onAdd={() => openModal("customer", "create")}
            onEdit={(customer) => openModal("customer", "edit", customer)}
            onDelete={(customer) => openConfirm("customer", customer.id, customer.name)}
            page={customerPage}
            pageSize={pageSize}
            onPageChange={setCustomerPage}
          />
        ) : null}

        {active === "events" ? (
          <Events
            events={events}
            venuesById={venueMap}
            loading={eventsLoading}
            error={eventsError}
            onAdd={() => openModal("event", "create")}
            onEdit={(event) => openModal("event", "edit", event)}
            onDelete={(event) => openConfirm("event", event.id, event.name)}
            page={eventPage}
            pageSize={pageSize}
            onPageChange={setEventPage}
          />
        ) : null}

        {active === "venues" ? (
          <Venues
            venues={venues}
            loading={venuesLoading}
            error={venuesError}
            onAdd={() => openModal("venue", "create")}
            onEdit={(venue) => openModal("venue", "edit", venue)}
            onDelete={(venue) => openConfirm("venue", venue.id, venue.name)}
            page={venuePage}
            pageSize={pageSize}
            onPageChange={setVenuePage}
          />
        ) : null}

        {active === "orders" ? (
          <Orders
            orders={orders}
            loading={ordersLoading}
            error={ordersError}
            onAdd={() => openModal("order", "create")}
            onRefresh={loadOrders}
            page={orderPage}
            pageSize={pageSize}
            onPageChange={setOrderPage}
          />
        ) : null}
      </main>

      <Modal
        open={modalOpen}
        title={`${modalMode === "edit" ? "Update" : "Add"} ${modalType}`}
        onClose={closeModal}
      >
        {modalType === "customer" ? (
          <form onSubmit={handleCustomerSubmit} className="form-grid">
            <label>
              <span>Name</span>
              <input
                name="name"
                value={customerForm.name}
                onChange={handleFormChange(setCustomerForm)}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                value={customerForm.email}
                onChange={handleFormChange(setCustomerForm)}
                type="email"
                required
              />
            </label>
            <label>
              <span>Address</span>
              <input
                name="address"
                value={customerForm.address}
                onChange={handleFormChange(setCustomerForm)}
                required
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                name="phoneNumber"
                value={customerForm.phoneNumber}
                onChange={handleFormChange(setCustomerForm)}
              />
            </label>
            <div className="form-actions">
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {modalMode === "edit" ? "Update customer" : "Create customer"}
              </button>
              <button className="btn btn--ghost" type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {modalType === "event" ? (
          <form onSubmit={handleEventSubmit} className="form-grid">
            <label>
              <span>Name</span>
              <input name="name" value={eventForm.name} onChange={handleFormChange(setEventForm)} required />
            </label>
            <label>
              <span>Venue</span>
              <select name="venueId" value={eventForm.venueId} onChange={handleFormChange(setEventForm)} required>
                <option value="">Select venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} (#{venue.id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Total capacity</span>
              <input
                name="totalCapacity"
                value={eventForm.totalCapacity}
                onChange={handleFormChange(setEventForm)}
                required
              />
            </label>
            <label>
              <span>Ticket price</span>
              <input
                name="ticketPrice"
                value={eventForm.ticketPrice}
                onChange={handleFormChange(setEventForm)}
                required
              />
            </label>
            <div className="form-actions">
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {modalMode === "edit" ? "Update event" : "Create event"}
              </button>
              <button className="btn btn--ghost" type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {modalType === "venue" ? (
          <form onSubmit={handleVenueSubmit} className="form-grid">
            <label>
              <span>Name</span>
              <input name="name" value={venueForm.name} onChange={handleFormChange(setVenueForm)} required />
            </label>
            <label>
              <span>Address</span>
              <input name="address" value={venueForm.address} onChange={handleFormChange(setVenueForm)} required />
            </label>
            <label>
              <span>Total capacity</span>
              <input
                name="totalCapacity"
                value={venueForm.totalCapacity}
                onChange={handleFormChange(setVenueForm)}
                required
              />
            </label>
            <div className="form-actions">
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {modalMode === "edit" ? "Update venue" : "Create venue"}
              </button>
              <button className="btn btn--ghost" type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {modalType === "order" ? (
          <form onSubmit={handleOrderSubmit} className="form-grid">
            <label>
              <span>Customer</span>
              <select name="customerId" value={orderForm.customerId} onChange={handleFormChange(setOrderForm)} required>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} (#{customer.id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Event</span>
              <select name="eventId" value={orderForm.eventId} onChange={handleFormChange(setOrderForm)} required>
                <option value="">Select event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} (#{event.id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Quantity</span>
              <input
                name="quantity"
                value={orderForm.quantity}
                onChange={handleFormChange(setOrderForm)}
                type="number"
                min="1"
                required
              />
            </label>
            <div className="form-actions">
              <button className="btn btn--primary" type="submit" disabled={saving}>
                Place order
              </button>
              <button className="btn btn--ghost" type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
            <p className="note">Order updates and deletes are not available from the backend.</p>
          </form>
        ) : null}
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        title="Confirm delete"
        message={`Delete ${confirmTarget.type} ${confirmTarget.label || `#${confirmTarget.id}`}?`}
        onConfirm={confirmDelete}
        onCancel={closeConfirm}
      />
    </div>
  );
}

export default App;

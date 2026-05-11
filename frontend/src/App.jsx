import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PublicHeader from "./components/PublicHeader";
import Modal from "./components/Modal";
import ConfirmModal from "./components/ConfirmModal";
import AuthPanel from "./components/AuthPanel";
import CustomerForm from "./features/customers/CustomerForm";
import Customers from "./features/customers/CustomersPage";
import Dashboard from "./features/dashboard/DashboardPage";
import EventForm from "./features/events/EventForm";
import Events from "./features/events/EventsPage";
import OrderForm from "./features/orders/OrderForm";
import Orders from "./features/orders/OrdersPage";
import VenueForm from "./features/venues/VenueForm";
import Venues from "./features/venues/VenuesPage";
import PublicBrowsePage from "./features/public/PublicBrowsePage";
import sections from "./config/sections";
import useTicketingState from "./hooks/useTicketingState";
import { clearAuthToken, getAuthToken, setAuthToken } from "./api/client";
import { loginWithPassword } from "./api/auth";
import { registerCustomer } from "./api/customers";
import { extractRoles, hasRole, parseJwtPayload } from "./utils/auth";

function App() {
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [token, setToken] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [pendingOrderEvent, setPendingOrderEvent] = useState(null);
  const pageSize = 6;

  const {
    customers,
    customersLoading,
    customersError,
    customerPage,
    setCustomerPage,
    customerForm,
    setCustomerForm,
    events,
    eventsLoading,
    eventsError,
    eventPage,
    setEventPage,
    eventForm,
    setEventForm,
    venues,
    venuesLoading,
    venuesError,
    venuePage,
    setVenuePage,
    venueForm,
    setVenueForm,
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
  } = useTicketingState();

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  const tokenPayload = useMemo(() => parseJwtPayload(token), [token]);
  const roles = useMemo(() => extractRoles(tokenPayload), [tokenPayload]);
  const isAdmin = hasRole(roles, "ADMIN");
  const isCustomer = hasRole(roles, "CUSTOMER");
  const resolvedRole = isAdmin ? "ADMIN" : isCustomer ? "CUSTOMER" : "";
  const isAuthenticated = Boolean(token && resolvedRole);
  const username = tokenPayload?.preferred_username || tokenPayload?.email || tokenPayload?.sub || "";

  const visibleSections = useMemo(() => {
    if (isAdmin) return sections;
    if (isCustomer) {
      return sections.filter((section) => section.id !== "customers");
    }
    return [];
  }, [isAdmin, isCustomer]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!visibleSections.some((section) => section.id === active)) {
      setActive("dashboard");
    }
  }, [active, isAuthenticated, visibleSections]);

  useEffect(() => {
    if (isAuthenticated && pendingOrderEvent) {
      // User just logged in and there's a pending order
      openModal("order", "create");
      setOrderForm({
        eventId: pendingOrderEvent.id,
        numberOfTickets: 1,
        customerId: "",
      });
      setPendingOrderEvent(null);
      setShowAuth(false);
    }
  }, [isAuthenticated, pendingOrderEvent, openModal, setOrderForm]);

  const handleLogin = async (form) => {
    setAuthLoading(true);
    setAuthError("");
    setAuthInfo("");
    try {
      const result = await loginWithPassword(form);
      const accessToken = result.access_token || "";
      const payload = parseJwtPayload(accessToken);
      const payloadRoles = extractRoles(payload);
      if (!hasRole(payloadRoles, "ADMIN") && !hasRole(payloadRoles, "CUSTOMER")) {
        throw new Error("Login succeeded, but token has no ADMIN or CUSTOMER role.");
      }
      setAuthToken(accessToken);
      setToken(accessToken);
      setAuthInfo("");
    } catch (error) {
      setAuthError(error?.message || "Unable to login.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (form) => {
    setAuthLoading(true);
    setAuthError("");
    setAuthInfo("");
    try {
      await registerCustomer(form);
      setAuthInfo("Registration successful. You can now sign in.");
    } catch (error) {
      setAuthError(error?.message || "Unable to register.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setToken("");
    setAuthError("");
    setAuthInfo("Signed out.");
    setShowAuth(false);
    setPendingOrderEvent(null);
  };

  const handlePublicOrderClick = (event) => {
    setPendingOrderEvent(event);
    setShowAuth(true);
  };

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleAuthClose = () => {
    if (!isAuthenticated) {
      setShowAuth(false);
      setPendingOrderEvent(null);
    }
  };

  // Show public browsing page for unauthenticated users
  if (!isAuthenticated && !showAuth) {
    return (
      <div className="public-browse" data-theme={theme}>
        <PublicHeader onLoginClick={handleLoginClick} />
        <PublicBrowsePage
          events={events}
          venues={venues}
          venuesById={venueMap}
          loading={eventsLoading || venuesLoading}
          error={eventsError || venuesError}
          onOrderClick={handlePublicOrderClick}
        />
      </div>
    );
  }

  // Show auth panel when login is needed
  if (!isAuthenticated && showAuth) {
    return (
      <AuthPanel
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={authLoading}
        error={authError}
        info={authInfo}
      />
    );
  }

  const handleCustomerChange = handleFormChange(setCustomerForm);
  const handleEventChange = handleFormChange(setEventForm);
  const handleVenueChange = handleFormChange(setVenueForm);
  const handleOrderChange = handleFormChange(setOrderForm);

  return (
    <div className={`app ${sidebarCollapsed ? "is-collapsed" : ""}`} data-theme={theme}>
      <Sidebar
        sections={visibleSections}
        active={active}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        onSelect={setActive}
      />

      <main className="content">
        <Header
          title={visibleSections.find((section) => section.id === active)?.label}
          saving={saving}
          actionMessage={actionMessage}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          role={resolvedRole}
          username={username}
          onLogout={handleLogout}
        />

        {active === "dashboard" && isAuthenticated ? (
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

        {active === "customers" && isAdmin ? (
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
            canManage={isAdmin}
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
            canManage={isAdmin}
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
            customersById={customerMap}
            eventsById={eventMap}
            showCustomer={isAdmin}
            page={orderPage}
            pageSize={pageSize}
            onPageChange={setOrderPage}
          />
        ) : null}
      </main>

      <Modal
        open={modalOpen && (isAdmin || modalType === "order")}
        title={`${modalMode === "edit" ? "Update" : "Add"} ${modalType}`}
        onClose={closeModal}
      >
        {modalType === "customer" && isAdmin ? (
          <CustomerForm
            form={customerForm}
            onChange={handleCustomerChange}
            onSubmit={handleCustomerSubmit}
            saving={saving}
            mode={modalMode}
            onCancel={closeModal}
          />
        ) : null}

        {modalType === "event" && isAdmin ? (
          <EventForm
            form={eventForm}
            venues={venues}
            onChange={handleEventChange}
            onSubmit={handleEventSubmit}
            saving={saving}
            mode={modalMode}
            onCancel={closeModal}
          />
        ) : null}

        {modalType === "venue" && isAdmin ? (
          <VenueForm
            form={venueForm}
            onChange={handleVenueChange}
            onSubmit={handleVenueSubmit}
            saving={saving}
            mode={modalMode}
            onCancel={closeModal}
          />
        ) : null}

        {modalType === "order" ? (
          <OrderForm
            form={orderForm}
            events={events}
            onChange={handleOrderChange}
            onSubmit={handleOrderSubmit}
            saving={saving}
            onCancel={closeModal}
          />
        ) : null}
      </Modal>

      <ConfirmModal
        open={confirmOpen && isAdmin}
        title="Confirm delete"
        message={`Delete ${confirmTarget.type} ${confirmTarget.label || `#${confirmTarget.id}`}?`}
        onConfirm={confirmDelete}
        onCancel={closeConfirm}
      />
    </div>
  );
}

export default App;

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Modal from "./components/Modal";
import ConfirmModal from "./components/ConfirmModal";
import CustomerForm from "./features/customers/CustomerForm";
import Customers from "./features/customers/CustomersPage";
import Dashboard from "./features/dashboard/DashboardPage";
import EventForm from "./features/events/EventForm";
import Events from "./features/events/EventsPage";
import OrderForm from "./features/orders/OrderForm";
import Orders from "./features/orders/OrdersPage";
import VenueForm from "./features/venues/VenueForm";
import Venues from "./features/venues/VenuesPage";
import sections from "./config/sections";
import useTicketingState from "./hooks/useTicketingState";

function App() {
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
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

  const handleCustomerChange = handleFormChange(setCustomerForm);
  const handleEventChange = handleFormChange(setEventForm);
  const handleVenueChange = handleFormChange(setVenueForm);
  const handleOrderChange = handleFormChange(setOrderForm);

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
            customersById={customerMap}
            eventsById={eventMap}
            page={orderPage}
            pageSize={pageSize}
            onPageChange={setOrderPage}
          />
        ) : null}
      </main>

      <Modal open={modalOpen} title={`${modalMode === "edit" ? "Update" : "Add"} ${modalType}`} onClose={closeModal}>
        {modalType === "customer" ? (
          <CustomerForm
            form={customerForm}
            onChange={handleCustomerChange}
            onSubmit={handleCustomerSubmit}
            saving={saving}
            mode={modalMode}
            onCancel={closeModal}
          />
        ) : null}

        {modalType === "event" ? (
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

        {modalType === "venue" ? (
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
            customers={customers}
            events={events}
            onChange={handleOrderChange}
            onSubmit={handleOrderSubmit}
            saving={saving}
            onCancel={closeModal}
          />
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

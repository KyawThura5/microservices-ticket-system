import DonutChart from "../components/DonutChart";
import { formatMoney } from "../utils/format";

export default function Dashboard({ stats, ordersLoading, ordersError, orders, orderStatusCounts, eventsLoading, eventsError, events }) {
  return (
    <section className="panel-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="panel-card">
          <p>{stat.label}</p>
          <h3>{stat.value}</h3>
          <span>{stat.hint}</span>
        </div>
      ))}
      <div className="panel-card panel-card--wide">
        <h3>Recent orders</h3>
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : ordersError ? (
          <p className="error">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <DonutChart counts={orderStatusCounts} />
        )}
      </div>
      <div className="panel-card panel-card--wide">
        <h3>Live inventory</h3>
        {eventsLoading ? (
          <p>Loading events...</p>
        ) : eventsError ? (
          <p className="error">{eventsError}</p>
        ) : events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <div className="table table--summary">
            <div className="table__row table__head">
              <span>Event</span>
              <span>Left</span>
              <span>Price</span>
            </div>
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="table__row">
                <span>{event.name}</span>
                <span>{event.leftCapacity ?? "—"}</span>
                <span>{formatMoney(event.ticketPrice)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

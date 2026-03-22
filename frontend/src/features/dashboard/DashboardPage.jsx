import DonutChart from "../../components/DonutChart";
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
    </section>
  );
}

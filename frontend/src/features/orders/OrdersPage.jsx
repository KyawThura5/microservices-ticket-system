import Pagination from "../../components/Pagination";
import { paginate, clampPage } from "../../utils/pagination";
import { formatMoney } from "../../utils/format";

export default function Orders({
  orders,
  loading,
  error,
  onAdd,
  onRefresh,
  customersById,
  eventsById,
  page,
  pageSize,
  onPageChange,
}) {
  const currentPage = clampPage(page, orders.length, pageSize);
  const pageItems = paginate(orders, currentPage, pageSize);

  return (
    <section className="section">
      <div className="data-card">
        <div className="data-card__header">
          <h3>Orders</h3>
          <div className="data-card__actions">
            <button className="btn btn--primary btn--tiny" onClick={onAdd}>
              New order
            </button>
            <button className="btn btn--ghost btn--tiny" type="button" onClick={onRefresh}>
              Refresh
            </button>
          </div>
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <>
            <div className="table table--orders">
              <div className="table__row table__head">
                <span>Order</span>
                <span>Customer</span>
                <span>Event</span>
                <span>Quantity</span>
                <span>Status</span>
                <span>Failure</span>
                <span>Total</span>
              </div>
              {pageItems.map((order) => (
                <div key={order.id} className="table__row">
                  <span>#{order.id}</span>
                  <span>{customersById?.get(order.customerId)?.name || `#${order.customerId}`}</span>
                  <span>{eventsById?.get(order.eventId)?.name || `#${order.eventId}`}</span>
                  <span>{order.quantity}</span>
                  <span className={`status status--${order.orderStatus?.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                  <span>{order.failureReason || "—"}</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              ))}
            </div>
            <Pagination page={currentPage} total={orders.length} pageSize={pageSize} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </section>
  );
}

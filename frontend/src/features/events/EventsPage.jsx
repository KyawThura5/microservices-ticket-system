import Pagination from "../../components/Pagination";
import { paginate, clampPage } from "../../utils/pagination";
import { formatMoney } from "../../utils/format";

export default function Events({ events, venuesById, loading, error, onAdd, onEdit, onDelete, page, pageSize, onPageChange }) {
  const currentPage = clampPage(page, events.length, pageSize);
  const pageItems = paginate(events, currentPage, pageSize);

  return (
    <section className="section">
      <div className="data-card">
        <div className="data-card__header">
          <h3>Events</h3>
          <button className="btn btn--primary btn--tiny" onClick={onAdd}>
            Add event
          </button>
        </div>
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <>
            <div className="table table--events">
              <div className="table__row table__head">
                <span>Name</span>
                <span>Venue</span>
                <span>Capacity</span>
                <span>Price</span>
                <span>Actions</span>
              </div>
              {pageItems.map((event) => (
                <div key={event.id} className="table__row">
                  <span>{event.name}</span>
                  <span>{venuesById.get(event.venueId)?.name || `#${event.venueId}`}</span>
                  <span>
                    {event.leftCapacity ?? "—"}/{event.totalCapacity ?? "—"}
                  </span>
                  <span>{formatMoney(event.ticketPrice)}</span>
                  <span className="table__actions">
                    <button className="btn btn--tiny" type="button" onClick={() => onEdit(event)}>
                      Edit
                    </button>
                    <button className="btn btn--tiny btn--ghost" type="button" onClick={() => onDelete(event)}>
                      Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <Pagination page={currentPage} total={events.length} pageSize={pageSize} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </section>
  );
}

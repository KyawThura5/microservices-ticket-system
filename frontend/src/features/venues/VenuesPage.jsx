import Pagination from "../../components/Pagination";
import { paginate, clampPage } from "../../utils/pagination";

export default function Venues({ venues, loading, error, onAdd, onEdit, onDelete, page, pageSize, onPageChange }) {
  const currentPage = clampPage(page, venues.length, pageSize);
  const pageItems = paginate(venues, currentPage, pageSize);

  return (
    <section className="section">
      <div className="data-card">
        <div className="data-card__header">
          <h3>Venues</h3>
          <button className="btn btn--primary btn--tiny" onClick={onAdd}>
            Add venue
          </button>
        </div>
        {loading ? (
          <p>Loading venues...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : venues.length === 0 ? (
          <p>No venues yet.</p>
        ) : (
          <>
            <div className="table table--venues">
              <div className="table__row table__head">
                <span>Name</span>
                <span>Address</span>
                <span>Capacity</span>
                <span>Actions</span>
              </div>
              {pageItems.map((venue) => (
                <div key={venue.id} className="table__row">
                  <span>{venue.name}</span>
                  <span>{venue.address}</span>
                  <span>{venue.totalCapacity}</span>
                  <span className="table__actions">
                    <button className="btn btn--tiny" type="button" onClick={() => onEdit(venue)}>
                      Edit
                    </button>
                    <button className="btn btn--tiny btn--ghost" type="button" onClick={() => onDelete(venue)}>
                      Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <Pagination page={currentPage} total={venues.length} pageSize={pageSize} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </section>
  );
}

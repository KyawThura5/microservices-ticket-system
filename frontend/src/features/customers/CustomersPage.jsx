import Pagination from "../../components/Pagination";
import { paginate, clampPage } from "../../utils/pagination";

export default function Customers({ customers, loading, error, onAdd, onEdit, onDelete, page, pageSize, onPageChange }) {
  const currentPage = clampPage(page, customers.length, pageSize);
  const pageItems = paginate(customers, currentPage, pageSize);

  return (
    <section className="section">
      <div className="data-card">
        <div className="data-card__header">
          <h3>Customers</h3>
          <button className="btn btn--primary btn--tiny" onClick={onAdd}>
            Add customer
          </button>
        </div>
        {loading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : customers.length === 0 ? (
          <p>No customers yet.</p>
        ) : (
          <>
            <div className="table table--customers">
              <div className="table__row table__head">
                <span>Name</span>
                <span>Email</span>
                <span>Address</span>
                <span>Actions</span>
              </div>
              {pageItems.map((customer) => (
                <div key={customer.id} className="table__row">
                  <span>{customer.name}</span>
                  <span>{customer.email}</span>
                  <span>{customer.address}</span>
                  <span className="table__actions">
                    <button className="btn btn--tiny" type="button" onClick={() => onEdit(customer)}>
                      Edit
                    </button>
                    <button className="btn btn--tiny btn--ghost" type="button" onClick={() => onDelete(customer)}>
                      Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <Pagination page={currentPage} total={customers.length} pageSize={pageSize} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </section>
  );
}

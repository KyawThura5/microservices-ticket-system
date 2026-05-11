export default function OrderForm({ form, events, onChange, onSubmit, saving, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="form-grid">
      <label>
        <span>Event</span>
        <select name="eventId" value={form.eventId} onChange={onChange} required>
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
        <input name="quantity" value={form.quantity} onChange={onChange} type="number" min="1" required />
      </label>
      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          Place order
        </button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <p className="note">Order updates and deletes are not available from the backend.</p>
    </form>
  );
}

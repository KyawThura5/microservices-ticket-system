export default function EventForm({ form, venues, onChange, onSubmit, saving, mode, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="form-grid">
      <label>
        <span>Name</span>
        <input name="name" value={form.name} onChange={onChange} required />
      </label>
      <label>
        <span>Venue</span>
        <select name="venueId" value={form.venueId} onChange={onChange} required>
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
        <input name="totalCapacity" value={form.totalCapacity} onChange={onChange} required />
      </label>
      <label>
        <span>Ticket price</span>
        <input name="ticketPrice" value={form.ticketPrice} onChange={onChange} required />
      </label>
      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {mode === "edit" ? "Update event" : "Create event"}
        </button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

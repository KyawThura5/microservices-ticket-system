export default function VenueForm({ form, onChange, onSubmit, saving, mode, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="form-grid">
      <label>
        <span>Name</span>
        <input name="name" value={form.name} onChange={onChange} required />
      </label>
      <label>
        <span>Address</span>
        <input name="address" value={form.address} onChange={onChange} required />
      </label>
      <label>
        <span>Total capacity</span>
        <input name="totalCapacity" value={form.totalCapacity} onChange={onChange} required />
      </label>
      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {mode === "edit" ? "Update venue" : "Create venue"}
        </button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

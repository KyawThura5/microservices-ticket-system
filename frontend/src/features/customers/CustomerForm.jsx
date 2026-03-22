export default function CustomerForm({ form, onChange, onSubmit, saving, mode, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="form-grid">
      <label>
        <span>Name</span>
        <input name="name" value={form.name} onChange={onChange} required />
      </label>
      <label>
        <span>Email</span>
        <input name="email" value={form.email} onChange={onChange} type="email" required />
      </label>
      <label>
        <span>Address</span>
        <input name="address" value={form.address} onChange={onChange} required />
      </label>
      <label>
        <span>Phone</span>
        <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
      </label>
      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {mode === "edit" ? "Update customer" : "Create customer"}
        </button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

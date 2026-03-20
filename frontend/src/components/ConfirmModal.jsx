export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal modal--confirm">
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onCancel} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="modal__body">
          <p>{message}</p>
          <div className="form-actions">
            <button className="btn btn--primary" type="button" onClick={onConfirm}>
              Yes, delete
            </button>
            <button className="btn btn--ghost" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

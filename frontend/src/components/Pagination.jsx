import { clampPage } from "../utils/pagination";

export default function Pagination({ page, total, pageSize, onPageChange }) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const current = clampPage(page, total, pageSize);

  return (
    <div className="pagination">
      <button
        className="btn btn--ghost btn--tiny"
        type="button"
        onClick={() => onPageChange(clampPage(current - 1, total, pageSize))}
        disabled={current <= 1}
      >
        Prev
      </button>
      <span>
        Page {current} of {maxPage}
      </span>
      <button
        className="btn btn--ghost btn--tiny"
        type="button"
        onClick={() => onPageChange(clampPage(current + 1, total, pageSize))}
        disabled={current >= maxPage}
      >
        Next
      </button>
    </div>
  );
}

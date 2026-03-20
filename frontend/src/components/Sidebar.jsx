export default function Sidebar({ sections, active, collapsed, onToggle, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__dot" />
        <div>
          <h1>TicketFlow</h1>
          <p>Operations console</p>
        </div>
      </div>
      <button
        className={`sidebar__toggle ${collapsed ? "" : "is-open"}`}
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className="nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav__item ${active === section.id ? "is-active" : ""}`}
            onClick={() => onSelect(section.id)}
          >
            <span>{section.label}</span>
            <small>{section.hint}</small>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function Header({
  title,
  saving,
  actionMessage,
  theme,
  onToggleTheme,
  onToggleSidebar,
  role,
  username,
  onLogout,
}) {
  return (
    <header className="content__header">
      <div>
        <p className="eyebrow">Ticket System</p>
        <h2>{title}</h2>
      </div>
      <div className="header__meta">
        <span>Status: {saving ? "Saving..." : "Ready"}</span>
        <span>User: {username || "Unknown"} ({role || "UNKNOWN"})</span>
        {actionMessage ? <span className="header__message">{actionMessage}</span> : null}
      </div>
      <button className="btn btn--ghost btn--tiny" type="button" onClick={onLogout}>
        Logout
      </button>
      <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
        <span className="theme-toggle__icon">{theme === "dark" ? "☀︎" : "☾"}</span>
      </button>
      <button className="hamburger" type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

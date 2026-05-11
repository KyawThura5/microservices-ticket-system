export default function PublicHeader({ onLoginClick }) {
  return (
    <header className="public-header">
      <div className="public-header__content">
        <div className="public-header__brand">
          <h1 className="public-header__title">🎫 Ticket System</h1>
          <p className="public-header__tagline">Discover and book amazing events</p>
        </div>
        
        <nav className="public-header__nav">
          <button className="btn btn--primary" onClick={onLoginClick}>
            Login / Register
          </button>
        </nav>
      </div>
    </header>
  );
}

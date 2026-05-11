import { useState } from "react";
import Pagination from "../../components/Pagination";
import { paginate, clampPage } from "../../utils/pagination";
import { formatMoney } from "../../utils/format";

export default function PublicBrowsePage({ events, venues, venuesById, loading, error, onOrderClick }) {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venuePage, setVenuePage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const pageSize = 6;

  const currentVenuePage = clampPage(venuePage, venues.length, pageSize);
  const venuePageItems = paginate(venues, currentVenuePage, pageSize);

  // Filter events for selected venue
  const venueEvents = selectedVenue 
    ? events.filter(event => event.venueId === selectedVenue.id)
    : [];
  
  const currentEventPage = clampPage(eventPage, venueEvents.length, pageSize);
  const eventPageItems = paginate(venueEvents, currentEventPage, pageSize);

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setEventPage(1); // Reset event page when selecting new venue
  };

  const handleBackToVenues = () => {
    setSelectedVenue(null);
    setVenuePage(1); // Reset venue page when going back
  };

  return (
    <main className="public-browse">
      <header className="public-browse__header">
        <div className="public-browse__hero">
          <h1 className="public-browse__title">
            {selectedVenue ? `Events at ${selectedVenue.name}` : "Discover Amazing Venues"}
          </h1>
          <p className="public-browse__subtitle">
            {selectedVenue 
              ? "Browse events at this venue and book your tickets" 
              : "Browse venues and click to explore their events"}
          </p>
          {selectedVenue && (
            <button className="btn btn--ghost" onClick={handleBackToVenues}>
              ← Back to All Venues
            </button>
          )}
        </div>
      </header>

      <section className="public-browse__content">
        {loading ? (
          <div className="public-browse__loading">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="public-browse__error">
            <p className="error">{error}</p>
          </div>
        ) : selectedVenue ? (
          // Show venue-specific events
          <div className="public-events">
            <h2>Events at {selectedVenue.name}</h2>
            <p className="venue-info">
              📍 {selectedVenue.address} | 🏟️ Capacity: {selectedVenue.totalCapacity} people
            </p>
            {venueEvents.length === 0 ? (
              <p>No events available at this venue at the moment.</p>
            ) : (
              <>
                <div className="public-events__grid">
                  {eventPageItems.map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-card__header">
                        <h3 className="event-card__title">{event.name}</h3>
                        <span className="event-card__price">{formatMoney(event.ticketPrice)}</span>
                      </div>
                      <div className="event-card__details">
                        <p className="event-card__venue">
                          📍 {selectedVenue.name}
                        </p>
                        <p className="event-card__capacity">
                          🎫 {event.leftCapacity ?? "N/A"} spots left out of {event.totalCapacity ?? "N/A"}
                        </p>
                      </div>
                      <div className="event-card__actions">
                        <button 
                          className="btn btn--primary btn--small"
                          onClick={() => onOrderClick(event)}
                          disabled={(event.leftCapacity ?? 0) <= 0}
                        >
                          {(event.leftCapacity ?? 0) > 0 ? "Order Tickets" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination 
                  page={currentEventPage} 
                  total={venueEvents.length} 
                  pageSize={pageSize} 
                  onPageChange={setEventPage} 
                />
              </>
            )}
          </div>
        ) : (
          // Show all venues
          <div className="public-venues">
            <h2>Event Venues</h2>
            {venues.length === 0 ? (
              <p>No venues available at the moment.</p>
            ) : (
              <>
                <div className="public-venues__grid">
                  {venuePageItems.map((venue) => (
                    <div key={venue.id} className="venue-card" onClick={() => handleVenueClick(venue)} style={{ cursor: 'pointer' }}>
                      <div className="venue-card__header">
                        <h3 className="venue-card__title">{venue.name}</h3>
                      </div>
                      <div className="venue-card__details">
                        <p className="venue-card__address">
                          📍 {venue.address}
                        </p>
                        <p className="venue-card__capacity">
                          🏟️ Capacity: {venue.totalCapacity} people
                        </p>
                        <p className="venue-card__event-count">
                          🎭 {events.filter(e => e.venueId === venue.id).length} event{events.filter(e => e.venueId === venue.id).length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                      <div className="venue-card__actions">
                        <button className="btn btn--primary btn--small">
                          View Events
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination 
                  page={currentVenuePage} 
                  total={venues.length} 
                  pageSize={pageSize} 
                  onPageChange={setVenuePage} 
                />
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

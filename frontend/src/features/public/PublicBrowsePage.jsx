import { useState } from "react";
import Pagination from "../../components/Pagination";
import { paginate, clampPage } from "../../utils/pagination";
import { formatMoney } from "../../utils/format";

export default function PublicBrowsePage({ events, venues, venuesById, loading, error, onOrderClick }) {
  const [activeTab, setActiveTab] = useState("events");
  const [eventPage, setEventPage] = useState(1);
  const [venuePage, setVenuePage] = useState(1);
  const pageSize = 6;

  const currentEventPage = clampPage(eventPage, events.length, pageSize);
  const eventPageItems = paginate(events, currentEventPage, pageSize);
  
  const currentVenuePage = clampPage(venuePage, venues.length, pageSize);
  const venuePageItems = paginate(venues, currentVenuePage, pageSize);

  return (
    <main className="public-browse">
      <header className="public-browse__header">
        <div className="public-browse__hero">
          <h1 className="public-browse__title">Discover Amazing Events</h1>
          <p className="public-browse__subtitle">Browse venues and events, and book your tickets</p>
        </div>
      </header>

      <div className="public-browse__tabs">
        <button 
          className={`btn ${activeTab === "events" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button 
          className={`btn ${activeTab === "venues" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setActiveTab("venues")}
        >
          Venues
        </button>
      </div>

      <section className="public-browse__content">
        {loading ? (
          <div className="public-browse__loading">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="public-browse__error">
            <p className="error">{error}</p>
          </div>
        ) : (
          <>
            {activeTab === "events" && (
              <div className="public-events">
                <h2>Upcoming Events</h2>
                {events.length === 0 ? (
                  <p>No events available at the moment.</p>
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
                              📍 {venuesById.get(event.venueId)?.name || `Venue #${event.venueId}`}
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
                      total={events.length} 
                      pageSize={pageSize} 
                      onPageChange={setEventPage} 
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === "venues" && (
              <div className="public-venues">
                <h2>Event Venues</h2>
                {venues.length === 0 ? (
                  <p>No venues available at the moment.</p>
                ) : (
                  <>
                    <div className="public-venues__grid">
                      {venuePageItems.map((venue) => (
                        <div key={venue.id} className="venue-card">
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
          </>
        )}
      </section>
    </main>
  );
}

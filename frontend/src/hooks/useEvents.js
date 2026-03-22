import { useCallback, useState } from "react";
import { listEvents } from "../api/events";

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [eventPage, setEventPage] = useState(1);
  const [eventForm, setEventForm] = useState({
    name: "",
    venueId: "",
    totalCapacity: "",
    ticketPrice: "",
  });
  const [eventEditingId, setEventEditingId] = useState(null);

  const loadEvents = useCallback(async () => {
    try {
      setEventsLoading(true);
      setEventsError("");
      const data = await listEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setEventsError(err?.message || "Unable to load events.");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const resetEventForm = useCallback(() => {
    setEventForm({ name: "", venueId: "", totalCapacity: "", ticketPrice: "" });
    setEventEditingId(null);
  }, []);

  return {
    events,
    eventsLoading,
    eventsError,
    eventPage,
    setEventPage,
    eventForm,
    setEventForm,
    eventEditingId,
    setEventEditingId,
    loadEvents,
    resetEventForm,
  };
}

import { useCallback, useState } from "react";
import { listVenues } from "../api/venues";

export default function useVenues() {
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState("");
  const [venuePage, setVenuePage] = useState(1);
  const [venueForm, setVenueForm] = useState({
    name: "",
    address: "",
    totalCapacity: "",
  });
  const [venueEditingId, setVenueEditingId] = useState(null);

  const loadVenues = useCallback(async () => {
    try {
      setVenuesLoading(true);
      setVenuesError("");
      const data = await listVenues();
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      setVenuesError(err?.message || "Unable to load venues.");
      setVenues([]);
    } finally {
      setVenuesLoading(false);
    }
  }, []);

  const resetVenueForm = useCallback(() => {
    setVenueForm({ name: "", address: "", totalCapacity: "" });
    setVenueEditingId(null);
  }, []);

  return {
    venues,
    venuesLoading,
    venuesError,
    venuePage,
    setVenuePage,
    venueForm,
    setVenueForm,
    venueEditingId,
    setVenueEditingId,
    loadVenues,
    resetVenueForm,
  };
}

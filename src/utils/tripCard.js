import ellaImg from "../assets/ella.jpg";
import sigiriyaImg from "../assets/sigiriya.jpg";
import sinharajaImg from "../assets/sinharaja.jpg";
import yalaImg from "../assets/yala.jpg";

// No per-trip photo exists yet (itinerary stops don't carry an image field),
// so real trips cycle through this placeholder set by index. Imported as
// modules (not raw path strings) so Vite actually resolves them — a bare
// "src/assets/x.jpg" string used directly in a background-image url() 404s,
// since it resolves against the page URL, not the project root.
const PLACEHOLDER_IMAGES = [ellaImg, sigiriyaImg, sinharajaImg, yalaImg];

const MONTH_ABBREV = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDateRange(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const startLabel = `${MONTH_ABBREV[start.getMonth()]} ${start.getDate()}`;
  const endLabel = `${MONTH_ABBREV[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  return `${startLabel} - ${endLabel}`;
}

// Trip has no stored status field — derived from travelStartDate: a trip
// with no dates set at all can't be classified as upcoming or past.
function deriveStatus(travelStartDate) {
  if (!travelStartDate) return "Unscheduled";
  const todayISO = new Date().toISOString().slice(0, 10);
  return travelStartDate >= todayISO ? "Upcoming" : "Past";
}

// Shared by MyTrips.jsx and Dashboard.jsx so both render trip cards
// identically instead of duplicating this derivation logic.
export function toTripCard(trip, index) {
  const prefs = trip.preferences || {};
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

  const primaryInterest = prefs.interests?.[0];
  const title = primaryInterest
    ? `${itinerary.length} places · ${
        primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)
      } trip`
    : `${itinerary.length} places`;

  const dateLabel =
    prefs.travelStartDate && prefs.travelEndDate
      ? formatDateRange(prefs.travelStartDate, prefs.travelEndDate)
      : prefs.duration
      ? `${prefs.duration} days`
      : null;

  const travelersLabel = prefs.travelers
    ? `${prefs.travelers} traveler${prefs.travelers === 1 ? "" : "s"}`
    : null;

  const destinationNames = itinerary.map((stop) => stop.title).filter(Boolean);
  const destinationsLabel =
    destinationNames.length > 3
      ? `${destinationNames.slice(0, 3).join(", ")} and ${destinationNames.length - 3} more`
      : destinationNames.join(", ");

  return {
    id: trip._id,
    title,
    dateLabel,
    travelersLabel,
    destinationsLabel,
    status: deriveStatus(prefs.travelStartDate),
    price: `LKR ${Math.round(
      (trip.total_estimated_cost_lkr || 0) + (trip.estimated_transport_cost_lkr || 0)
    ).toLocaleString()}`,
    distance: `${Math.round(trip.total_distance_km || 0)} km`,
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
  };
}

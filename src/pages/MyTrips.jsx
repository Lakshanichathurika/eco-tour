import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MdDelete } from "react-icons/md";
import { getTrips, deleteTrip } from "../lib/api";
import { getClientId } from "../utils/clientId";
import ellaImg from "../assets/ella.jpg";
import sigiriyaImg from "../assets/sigiriya.jpg";
import sinharajaImg from "../assets/sinharaja.jpg";
import yalaImg from "../assets/yala.jpg";

// No per-trip photo exists yet (itinerary stops don't carry an image field),
// so real trips cycle through the same placeholder set the old hardcoded
// version used, by index. Imported as modules (not raw path strings) so Vite
// actually resolves them — a bare "src/assets/x.jpg" string used directly in
// a background-image url() 404s, since it resolves against the page URL, not
// the project root.
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

function toCard(trip, index) {
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
    price: `LKR ${Math.round(
      (trip.total_estimated_cost_lkr || 0) + (trip.estimated_transport_cost_lkr || 0)
    ).toLocaleString()}`,
    distance: `${Math.round(trip.total_distance_km || 0)} km`,
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
  };
}

function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips(getClientId())
      .then((data) => setTrips(data.map(toCard)))
      .catch((err) => console.warn("Failed to load trips:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      setTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== id));
    } catch (err) {
      console.warn("Failed to delete trip:", err);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-[#f3f3f1] py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.04em] text-[#1f2d2a] leading-none">
                My Trips ...
              </h1>
              <p className="text-[#2D6A52] text-2xl mt-7 font-medium">
                Your Library
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/plantrip")}
              className="inline-flex items-center gap-3 rounded-xl bg-[#2E6B4F] px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-[#255b42] transition"
            >
              <span className="text-2xl leading-none">+</span>
              <span>New Trip</span>
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-[#b5c8bf] bg-[#f8f8f8] p-12 text-center text-[#3a524a]">
              Loading your trips...
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#b5c8bf] bg-[#f8f8f8] p-12 text-center text-[#3a524a]">
              No trips yet. Create a new one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <article
                  key={trip.id}
                  onClick={() => navigate(`/mytrips/${trip.id}`)}
                  className="cursor-pointer rounded-[26px] overflow-hidden border border-[#e6e2db] bg-[#f8f8f8] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="h-64 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${trip.image})` }}
                  />

                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg text-[#2d2d2d] font-medium truncate">
                        {trip.title}
                      </p>
                      <span className="inline-flex items-center justify-center rounded-full bg-[#f3d9a8] px-2.5 py-1 text-[11px] font-bold text-[#6f4b12] border border-[#e9c98d]">
                        ECO 88
                      </span>
                    </div>

                    {trip.dateLabel && (
                      <p className="mt-2 text-sm text-[#4a4d48]">{trip.dateLabel}</p>
                    )}

                    {trip.destinationsLabel && (
                      <p className="mt-1 text-sm text-[#4a4d48] truncate">
                        {trip.destinationsLabel}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-sm text-[#4a4d48]">
                      {trip.travelersLabel && <span>{trip.travelersLabel}</span>}
                      <span>{trip.price}</span>
                      <span>{trip.distance}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <button
                        type="button"
                        aria-label="Delete trip"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f5] border border-[#d9d9d9] text-[#1f2d2a] hover:bg-[#e9ece7] transition"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default MyTrips;

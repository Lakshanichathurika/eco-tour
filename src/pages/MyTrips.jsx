import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MdDelete } from "react-icons/md";
import { getTrips, deleteTrip } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toTripCard } from "../utils/tripCard";

function MyTrips() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrips(token)
      .then((data) => setTrips(data.map(toTripCard)))
      .catch(() => setError("Couldn't load your trips. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id, token);
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
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-red-300 bg-red-50 p-12 text-center text-red-700">
              {error}
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

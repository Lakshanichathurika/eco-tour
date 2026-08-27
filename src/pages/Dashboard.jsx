import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdBookmarkRemove } from "react-icons/md";
import heroImg from "../assets/hero.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getDashboard, unsaveDestination } from "../lib/api";
import { toTripCard } from "../utils/tripCard";

const STATUS_STYLES = {
  Upcoming: "bg-green-400/20 text-green-300 border-green-400/40",
  Past: "bg-white/10 text-gray-300 border-white/20",
  Unscheduled: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.max(0, Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24)));
}

function StatCard({ label, value }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
      <p className="text-4xl font-serif text-yellow-400">{value}</p>
      <p className="text-gray-300 mt-2">{label}</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard(token)
      .then(setData)
      .catch(() => setError("Couldn't load your dashboard. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUnsave = async (destId) => {
    try {
      await unsaveDestination(destId, token);
      setData((prev) => ({
        ...prev,
        savedDestinations: prev.savedDestinations.filter((d) => d.id !== destId),
      }));
    } catch (err) {
      console.warn("Failed to remove saved destination:", err);
    }
  };

  const recentTripCards = data?.recentTrips?.map((t, i) => toTripCard(t, i)) || [];
  const daysUntilNext = daysUntil(data?.nextTrip?.preferences?.travelStartDate);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="min-h-screen bg-black/70">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-white text-4xl md:text-5xl font-serif mb-10">
            Welcome back{user ? `, ${user.name}` : ""}
          </h1>

          {loading ? (
            <div className="bg-black/40 border border-white/20 rounded-2xl p-12 text-center text-gray-300">
              Loading your dashboard...
            </div>
          ) : error ? (
            <div className="bg-red-950/40 border border-red-400/30 rounded-2xl p-12 text-center text-red-300">
              {error}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label="Total Trips" value={data.totalTrips} />
                <StatCard label="Upcoming Trips" value={data.upcomingTrips.length} />
                <StatCard
                  label={data.nextTrip ? "Days Until Next Trip" : "No Upcoming Trip"}
                  value={data.nextTrip ? daysUntilNext : "—"}
                />
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/plantrip")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold transition"
                >
                  Plan New Trip
                </button>
                <button
                  onClick={() => navigate("/destination")}
                  className="bg-white/20 backdrop-blur-md border border-white text-white px-6 py-3 rounded-full transition hover:bg-white/30"
                >
                  Explore Destinations
                </button>
              </div>

              {/* My Trips preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-2xl font-serif">My Trips</h2>
                  <button
                    onClick={() => navigate("/mytrips")}
                    className="text-yellow-400 hover:underline text-sm font-semibold"
                  >
                    View All Trips →
                  </button>
                </div>

                {recentTripCards.length === 0 ? (
                  <div className="bg-black/40 border border-dashed border-white/20 rounded-2xl p-8 text-center text-gray-300">
                    No trips yet — plan your first trip!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentTripCards.map((trip) => (
                      <div
                        key={trip.id}
                        onClick={() => navigate(`/mytrips/${trip.id}`)}
                        className="cursor-pointer bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition hover:-translate-y-1"
                      >
                        <div
                          className="h-32 w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${trip.image})` }}
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-white font-medium truncate">{trip.title}</p>
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${STATUS_STYLES[trip.status]}`}
                            >
                              {trip.status}
                            </span>
                          </div>
                          {trip.dateLabel && (
                            <p className="text-gray-300 text-sm mt-1">{trip.dateLabel}</p>
                          )}
                          {trip.destinationsLabel && (
                            <p className="text-gray-400 text-xs mt-1 truncate">
                              {trip.destinationsLabel}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Profile card */}
                <div>
                  <h2 className="text-white text-2xl font-serif mb-4">Profile</h2>
                  <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <p className="text-white text-lg font-medium">{user?.name}</p>
                    <p className="text-gray-300 mt-1">{user?.email}</p>
                    <button
                      onClick={() => navigate("/profile")}
                      className="mt-4 bg-white/20 backdrop-blur-md border border-white text-white px-5 py-2 rounded-full text-sm transition hover:bg-white/30"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Saved Destinations */}
                <div>
                  <h2 className="text-white text-2xl font-serif mb-4">Saved Destinations</h2>
                  {data.savedDestinations.length === 0 ? (
                    <div className="bg-black/40 border border-dashed border-white/20 rounded-2xl p-6 text-center text-gray-300">
                      No saved destinations yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {data.savedDestinations.map((dest) => (
                        <div
                          key={dest.id}
                          className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden"
                        >
                          <div
                            className="h-20 w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${dest.image})` }}
                          />
                          <p className="text-white text-sm p-2 truncate">{dest.title}</p>
                          <button
                            type="button"
                            aria-label="Remove saved destination"
                            onClick={() => handleUnsave(dest.id)}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-yellow-400 rounded-full p-1.5 transition"
                          >
                            <MdBookmarkRemove className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;

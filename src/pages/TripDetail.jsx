import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TripResultsView from "../components/TripResultsView";
import { getTripById } from "../lib/api";
import { getClientId } from "../utils/clientId";

function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getTripById(tripId, getClientId())
      .then((data) => {
        if (!data) {
          setNotFound(true);
        } else {
          setTrip(data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [tripId]);

  return (
    <>
      <Navbar />
      <section className="bg-stone-50 py-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <button
            type="button"
            onClick={() => navigate("/mytrips")}
            className="text-sm text-[#2E6B4F] font-semibold mb-8 hover:underline"
          >
            &larr; Back to My Trips
          </button>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">
              Loading trip...
            </div>
          ) : notFound ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">
              This trip couldn't be found.
            </div>
          ) : (
            <TripResultsView
              itinerary={trip.itinerary}
              total_places={trip.itinerary.length}
              total_estimated_cost_lkr={trip.total_estimated_cost_lkr}
              estimated_transport_cost_lkr={trip.estimated_transport_cost_lkr}
              total_distance_km={trip.total_distance_km}
              travelers={trip.preferences?.travelers ?? 1}
              vehicleType={trip.preferences?.vehicle_type ?? "car"}
            />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default TripDetail;

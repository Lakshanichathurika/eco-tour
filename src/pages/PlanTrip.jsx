import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DestinationCard from "../components/DestinationCard";
import MapView from "../components/MapView";
import TravelModeSelector from "../components/TravelModeSelector";
import DirectionsPanel from "../components/DirectionsPanel";
import WeatherBadge from "../components/WeatherBadge";
import useWeatherForItinerary from "../hooks/useWeatherForItinerary";
import { postRecommendations } from "../lib/api";

const INTERESTS = ["wildlife", "hiking", "culture", "beach"];
const SEASONS = [
  { value: "no_preference", label: "No preference" },
  { value: "Dec-Mar", label: "Dec - Mar" },
  { value: "Apr-Sep", label: "Apr - Sep" },
  { value: "Oct-Nov", label: "Oct - Nov" },
  { value: "Year-round", label: "Year-round" },
];

// Maps the Rs 20,000-150,000 slider onto the rule engine's low/medium/high
// budget tiers — an explainable boundary rule, same style as the backend rules.
function budgetLkrToTier(value) {
  if (value < 60000) return "low";
  if (value <= 100000) return "medium";
  return "high";
}

function PlanTrip() {
  const [budgetLkr, setBudgetLkr] = useState(60000);
  const [duration, setDuration] = useState(3);
  const [interests, setInterests] = useState([]);
  const [travelSeason, setTravelSeason] = useState("no_preference");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [directionsLegs, setDirectionsLegs] = useState([]);
  const weatherByDestinationId = useWeatherForItinerary(results?.itinerary);

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }
    if (!duration || duration < 1) {
      setError("Please enter a valid trip length.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await postRecommendations({
        budget: budgetLkrToTier(budgetLkr),
        duration: Number(duration),
        interests,
        travelSeason,
      });
      if (!response.success) {
        setError(response.message || "Something went wrong.");
        setResults(null);
      } else {
        setResults(response);
        setDirectionsLegs([]);
      }
    } catch (err) {
      setError("Could not reach the recommendation service.");
      setResults(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <main className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-4">Plan Your Trip</h1>
            <p className="text-gray-600">
              Tell us your preferences and our rule-based engine will suggest
              eco-friendly destinations and a day-by-day itinerary.
            </p>
          </main>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-8 grid gap-6 sm:grid-cols-2"
          >
            <div>
              <label className="block font-semibold mb-2" htmlFor="budget-slider">
                Budget: Rs {budgetLkr.toLocaleString()}{" "}
                <span className="text-gray-500 font-normal capitalize">
                  ({budgetLkrToTier(budgetLkr)})
                </span>
              </label>
              <input
                id="budget-slider"
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={budgetLkr}
                onChange={(e) => setBudgetLkr(Number(e.target.value))}
                className="w-full accent-[#2E6B4F]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Rs 20,000</span>
                <span>Rs 150,000</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2" htmlFor="duration-input">
                Trip length (days)
              </label>
              <input
                id="duration-input"
                type="number"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-white px-5 py-3 text-stone-900 shadow-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2" htmlFor="season-select">
                Travel season
              </label>
              <select
                id="season-select"
                value={travelSeason}
                onChange={(e) => setTravelSeason(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-white px-5 py-3 text-stone-900 shadow-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-200"
              >
                {SEASONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block font-semibold mb-2">Interests</span>
              <div className="flex flex-wrap gap-4">
                {INTERESTS.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 capitalize text-stone-700"
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                      className="accent-[#2E6B4F]"
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="sm:col-span-2 text-red-600 text-sm">{error}</div>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#2E6B4F] text-white font-semibold rounded-full px-8 py-3 hover:bg-green-900 transition disabled:opacity-50"
              >
                {submitting ? "Finding destinations..." : "Get Recommendations"}
              </button>
            </div>
          </form>

          {results && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Recommended Destinations</h2>

              {results.recommendations.length === 0 ? (
                <p className="text-gray-600">
                  No destinations matched your preferences — try widening your
                  interests or season.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {results.recommendations.map((item) => (
                    <div key={item.id}>
                      <DestinationCard
                        image={item.image}
                        title={item.title}
                        location={item.location}
                        description={item.description}
                        onClickMain={() => {}}
                        onLearnMore={() => {}}
                      />
                      <div className="mt-3 px-1">
                        <p className="font-semibold text-green-700">
                          Match score: {item.score}/100
                        </p>
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-500 space-y-1">
                          {item.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.itinerary.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                    <h2 className="text-3xl font-bold">Suggested Itinerary</h2>
                    <p className="text-gray-600">
                      <span className="font-semibold text-green-700">
                        {results.total_places}
                      </span>{" "}
                      places &middot; est.{" "}
                      <span className="font-semibold text-green-700">
                        Rs {results.total_estimated_cost_lkr.toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <TravelModeSelector value={travelMode} onChange={setTravelMode} />
                  </div>

                  <div className="mb-8">
                    <MapView
                      itinerary={results.itinerary}
                      travelMode={travelMode}
                      onDirectionsChange={setDirectionsLegs}
                      weatherByDestinationId={weatherByDestinationId}
                    />
                  </div>

                  <DirectionsPanel legs={directionsLegs} travelMode={travelMode} />

                  <ol className="space-y-4">
                    {results.itinerary.map((stop, i) => (
                      <li
                        key={i}
                        className="bg-white rounded-2xl shadow-md p-6"
                      >
                        <p className="font-semibold">
                          {stop.day_range}: {stop.title}{" "}
                          <span className="text-gray-500 font-normal capitalize">
                            — {stop.activity_focus}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {stop.notes}
                        </p>
                        <p className="text-sm text-green-700 font-semibold mt-2">
                          Est. cost: Rs {stop.estimated_cost_lkr.toLocaleString()}
                        </p>
                        <div className="mt-2">
                          <WeatherBadge weather={weatherByDestinationId[stop.destination_id]} />
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PlanTrip;

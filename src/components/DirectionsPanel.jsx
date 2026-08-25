import { useEffect, useState } from "react";
import { getNearbyRestStops } from "../lib/api";

const TRAVEL_MODE_LABEL = {
  DRIVING: "Driving",
  WALKING: "Walking",
  TRANSIT: "Transit",
};

export default function DirectionsPanel({ legs, travelMode }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const [restStopsByLeg, setRestStopsByLeg] = useState({});

  useEffect(() => {
    legs.forEach((leg) => {
      if (restStopsByLeg[leg.key] !== undefined) return;
      setRestStopsByLeg((prev) => ({ ...prev, [leg.key]: "loading" }));
      getNearbyRestStops(leg.midpoint.lat, leg.midpoint.lng)
        .then((stops) => setRestStopsByLeg((prev) => ({ ...prev, [leg.key]: stops })))
        .catch((err) =>
          setRestStopsByLeg((prev) => ({ ...prev, [leg.key]: { error: err.message } }))
        );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legs]);

  if (!legs || legs.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      <h3 className="text-xl font-bold mb-2">
        Turn-by-turn directions ({TRAVEL_MODE_LABEL[travelMode] || travelMode})
      </h3>
      {legs.map((leg, i) => {
        const isOpen = expandedKey === leg.key;
        const restStops = restStopsByLeg[leg.key];

        return (
          <div key={leg.key} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedKey(isOpen ? null : leg.key)}
              className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center gap-4"
            >
              <span>
                Leg {i + 1}: {leg.from} to {leg.to} — {leg.steps.length} steps
                {leg.durationText ? `, ~${leg.durationText}` : ""}
              </span>
              <span className="text-gray-400">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 space-y-4">
                {/* step.instructions is HTML from Google's own Directions response
                    (not user input), so rendering it directly is safe here. */}
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  {leg.steps.map((step, si) => (
                    <li key={si} dangerouslySetInnerHTML={{ __html: step.instructions }} />
                  ))}
                </ol>

                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    Stop for a break:
                  </p>
                  {restStops === "loading" && (
                    <p className="text-sm text-gray-400">Finding nearby rest stops...</p>
                  )}
                  {restStops?.error && (
                    <p className="text-sm text-gray-400">
                      Rest stop suggestions unavailable ({restStops.error}).
                    </p>
                  )}
                  {Array.isArray(restStops) && restStops.length === 0 && (
                    <p className="text-sm text-gray-400">No rest stops found nearby.</p>
                  )}
                  {Array.isArray(restStops) && restStops.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {restStops.map((stop, si) => (
                        <div key={si} className="border border-stone-200 rounded-xl p-3">
                          <p className="font-medium text-sm">{stop.name}</p>
                          {stop.rating != null && (
                            <p className="text-xs text-gray-500">★ {stop.rating}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

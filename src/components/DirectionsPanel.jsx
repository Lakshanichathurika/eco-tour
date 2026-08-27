import { useState } from "react";

const TRAVEL_MODE_LABEL = {
  DRIVING: "Driving",
  WALKING: "Walking",
  TRANSIT: "Transit",
};

export default function DirectionsPanel({ legs, travelMode }) {
  const [expandedKey, setExpandedKey] = useState(null);

  if (!legs || legs.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      <h3 className="text-xl font-bold mb-2">
        Turn-by-turn directions ({TRAVEL_MODE_LABEL[travelMode] || travelMode})
      </h3>
      {legs.map((leg, i) => {
        const isOpen = expandedKey === leg.key;

        return (
          <div key={leg.key} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedKey(isOpen ? null : leg.key)}
              className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center gap-4 min-w-0"
            >
              <span className="flex-1 min-w-0 truncate">
                Leg {i + 1}: {leg.from} to {leg.to} — {leg.steps.length} steps
                {leg.durationText ? `, ~${leg.durationText}` : ""}
              </span>
              <span className="text-gray-400 shrink-0">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="px-6 pb-6">
                {/* step.instructions is HTML from Google's own Directions response
                    (not user input), so rendering it directly is safe here. */}
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  {leg.steps.map((step, si) => (
                    <li key={si} dangerouslySetInnerHTML={{ __html: step.instructions }} />
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

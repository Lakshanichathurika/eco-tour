import { useEffect, useState } from "react";
import { getNearbyPlaces } from "../lib/api";

function buildQueryPoints(legs, itinerary) {
  const legPoints = (legs || []).map((leg) => ({
    key: `leg:${leg.key}`,
    label: `Between ${leg.from} and ${leg.to}`,
    lat: leg.midpoint.lat,
    lng: leg.midpoint.lng,
  }));

  const overnightPoints = (itinerary || [])
    .filter((stop) => stop.coordinates && stop.recommended_stay_days > 0)
    .map((stop) => ({
      key: `stay:${stop.destination_id}`,
      label: stop.title,
      lat: stop.coordinates.lat,
      lng: stop.coordinates.lng,
    }));

  return [...legPoints, ...overnightPoints];
}

function PlacesSubsection({ title, places }) {
  return (
    <div>
      <p className="text-sm font-semibold text-green-700 mb-2">{title}</p>
      {!places || places.length === 0 ? (
        <p className="text-sm text-gray-400">No suggestions found nearby.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {places.map((place, i) => (
            <div key={i} className="border border-stone-200 rounded-xl p-3">
              <p className="font-medium text-sm">{place.name}</p>
              {place.rating != null && (
                <p className="text-xs text-gray-500">★ {place.rating}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StopsPanel({ legs, itinerary }) {
  const [placesByPoint, setPlacesByPoint] = useState({});

  const points = buildQueryPoints(legs, itinerary);

  useEffect(() => {
    points.forEach((point) => {
      if (placesByPoint[point.key] !== undefined) return;
      setPlacesByPoint((prev) => ({ ...prev, [point.key]: "loading" }));
      getNearbyPlaces(point.lat, point.lng)
        .then((data) => setPlacesByPoint((prev) => ({ ...prev, [point.key]: data })))
        .catch((err) =>
          setPlacesByPoint((prev) => ({ ...prev, [point.key]: { error: err.message } }))
        );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legs, itinerary]);

  if (points.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      <h3 className="text-xl font-bold mb-2">Where to eat &amp; stay</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {points.map((point) => {
          const result = placesByPoint[point.key];
          return (
            <div key={point.key} className="bg-white rounded-2xl shadow-md p-6">
              <p className="font-semibold mb-3">{point.label}</p>

              {result === "loading" && (
                <p className="text-sm text-gray-400">Finding nearby places...</p>
              )}
              {result?.error && (
                <p className="text-sm text-gray-400">
                  Suggestions unavailable ({result.error}).
                </p>
              )}
              {result && result !== "loading" && !result.error && (
                <div className="space-y-4">
                  <PlacesSubsection title="Where to eat" places={result.food} />
                  <PlacesSubsection title="Where to stay" places={result.accommodation} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

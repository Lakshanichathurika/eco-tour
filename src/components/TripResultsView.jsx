import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MapView from "./MapView";
import TravelModeSelector from "./TravelModeSelector";
import DirectionsPanel from "./DirectionsPanel";
import StopsPanel from "./StopsPanel";
import WeatherBadge from "./WeatherBadge";
import useWeatherForItinerary from "../hooks/useWeatherForItinerary";
import { VEHICLE_TYPE_GROUPS, VEHICLE_TYPE_OPTIONS } from "../constants/vehicleTypes";

// Shared between the live trip-planning results and the saved-trip detail view
// (src/pages/TripDetail.jsx) — same rendering either way, just fed live
// results vs. a saved trip's stored data. Owns its own map/directions/stops UI
// state so both callers stay simple.
export default function TripResultsView({
  itinerary,
  total_places,
  total_estimated_cost_lkr,
  estimated_transport_cost_lkr,
  total_distance_km,
  travelers,
  vehicleType,
}) {
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [directionsLegs, setDirectionsLegs] = useState([]);
  const [expandedStopId, setExpandedStopId] = useState(null);
  const weatherByDestinationId = useWeatherForItinerary(itinerary);
  const isPublicTransportVehicle = VEHICLE_TYPE_GROUPS.find(
    (g) => g.group === "Public Transport"
  ).options.some((v) => v.value === vehicleType);

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Suggested Itinerary</h2>
        <div className="text-gray-600 text-right">
          <p>
            <span className="font-semibold text-green-700">{total_places}</span>{" "}
            places &middot; entry &amp; activities: est.{" "}
            <span className="font-semibold text-green-700">
              Rs {total_estimated_cost_lkr.toLocaleString()}
            </span>
          </p>
          <p className="mt-1">
            Estimated transport (
            {VEHICLE_TYPE_OPTIONS.find((v) => v.value === vehicleType)?.label}): est.{" "}
            <span className="font-semibold text-green-700">
              Rs {Math.round(estimated_transport_cost_lkr).toLocaleString()}
            </span>{" "}
            <span className="text-xs text-gray-400">
              {isPublicTransportVehicle
                ? `(${travelers} traveler${
                    Number(travelers) === 1 ? "" : "s"
                  } · ${total_distance_km.toFixed(1)} km straight-line estimate)`
                : `(${total_distance_km.toFixed(1)} km · per vehicle, straight-line estimate)`}
            </span>
          </p>
          <p className="mt-1 font-semibold">
            Total: est.{" "}
            <span className="text-green-700">
              Rs{" "}
              {(total_estimated_cost_lkr + estimated_transport_cost_lkr).toLocaleString(
                undefined,
                { maximumFractionDigits: 0 }
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-4">
        <TravelModeSelector value={travelMode} onChange={setTravelMode} />
      </div>

      <div className="mb-8">
        <MapView
          itinerary={itinerary}
          travelMode={travelMode}
          onDirectionsChange={setDirectionsLegs}
          weatherByDestinationId={weatherByDestinationId}
        />
      </div>

      <DirectionsPanel legs={directionsLegs} travelMode={travelMode} />

      <StopsPanel legs={directionsLegs} itinerary={itinerary} />

      <ol className="space-y-4">
        {itinerary.map((stop, i) => (
          <li key={i} className="bg-white rounded-2xl shadow-md p-6">
            <p className="font-semibold">
              {stop.day_range}: {stop.title}{" "}
              <span className="text-gray-500 font-normal capitalize">
                — {stop.activity_focus}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">{stop.notes}</p>
            {stop.cost_breakdown ? (
              <button
                type="button"
                onClick={() =>
                  setExpandedStopId(
                    expandedStopId === stop.destination_id ? null : stop.destination_id
                  )
                }
                className="flex items-center gap-1 text-sm text-green-700 font-semibold mt-2 min-w-0"
              >
                <span className="min-w-0">
                  Rs {stop.destination_total_cost_lkr.toLocaleString()} (Rs{" "}
                  {stop.entry_fee_per_person_lkr.toLocaleString()} x {travelers} traveler
                  {Number(travelers) === 1 ? "" : "s"} + Rs{" "}
                  {stop.shared_group_cost_lkr.toLocaleString()} shared)
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${
                    expandedStopId === stop.destination_id ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <p className="text-sm text-green-700 font-semibold mt-2">
                Rs {stop.destination_total_cost_lkr.toLocaleString()} (Rs{" "}
                {stop.entry_fee_per_person_lkr.toLocaleString()} x {travelers} traveler
                {Number(travelers) === 1 ? "" : "s"} + Rs{" "}
                {stop.shared_group_cost_lkr.toLocaleString()} shared)
              </p>
            )}
            {expandedStopId === stop.destination_id && stop.cost_breakdown && (
              <div className="mt-2 text-sm text-gray-600 bg-stone-50 rounded-xl p-3">
                <p>{stop.cost_breakdown}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Approximate — verify current rates before finalizing.
                </p>
              </div>
            )}
            <div className="mt-2">
              <WeatherBadge weather={weatherByDestinationId[stop.destination_id]} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

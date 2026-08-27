import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import WeatherBadge from "./WeatherBadge";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const CONTAINER_STYLE = { width: "100%", height: "100%" };
const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

function legKey(a, b, travelMode) {
  return `${a.destination_id}|${b.destination_id}|${travelMode}`;
}

function MapInner({ itinerary, travelMode, onDirectionsChange, weatherByDestinationId }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
  });

  const [legResults, setLegResults] = useState({});
  const [activeStopId, setActiveStopId] = useState(null);

  const stopsWithCoordinates = itinerary.filter((stop) => stop.coordinates);
  const consecutivePairs = stopsWithCoordinates
    .slice(0, -1)
    .map((stop, i) => [stop, stopsWithCoordinates[i + 1]]);

  useEffect(() => {
    if (!onDirectionsChange) return;
    const legs = consecutivePairs
      .map(([a, b]) => {
        const key = legKey(a, b, travelMode);
        const result = legResults[key];
        const leg = result?.routes?.[0]?.legs?.[0];
        if (!leg) return null;
        return {
          key,
          from: a.title,
          to: b.title,
          distanceText: leg.distance?.text,
          durationText: leg.duration?.text,
          steps: leg.steps,
          midpoint: {
            lat: (a.coordinates.lat + b.coordinates.lat) / 2,
            lng: (a.coordinates.lng + b.coordinates.lng) / 2,
          },
        };
      })
      .filter(Boolean);
    onDirectionsChange(legs);
    // Only re-run when the itinerary or travel mode actually changes what
    // legs *should* exist, or when a new leg result comes in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legResults, travelMode, itinerary]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-red-600 bg-stone-100 rounded-2xl">
        Failed to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 bg-stone-100 rounded-2xl">
        Loading map...
      </div>
    );
  }

  const center = stopsWithCoordinates[0]?.coordinates || SRI_LANKA_CENTER;
  const activeStop = stopsWithCoordinates.find((s) => s.destination_id === activeStopId);

  return (
    <GoogleMap mapContainerStyle={CONTAINER_STYLE} center={center} zoom={8}>
      {stopsWithCoordinates.map((stop) => (
        <Marker
          key={stop.visit_order}
          position={stop.coordinates}
          label={String(stop.visit_order)}
          title={stop.title}
          onClick={() => setActiveStopId(stop.destination_id)}
        />
      ))}

      {activeStop && (
        <InfoWindow
          position={activeStop.coordinates}
          onCloseClick={() => setActiveStopId(null)}
        >
          <div className="text-sm">
            <p className="font-semibold mb-1">{activeStop.title}</p>
            <WeatherBadge weather={weatherByDestinationId[activeStop.destination_id]} />
          </div>
        </InfoWindow>
      )}

      {consecutivePairs.map(([a, b]) => {
        const key = legKey(a, b, travelMode);
        if (legResults[key]) return null;
        return (
          <DirectionsService
            key={key}
            options={{
              origin: a.coordinates,
              destination: b.coordinates,
              travelMode: window.google.maps.TravelMode[travelMode],
            }}
            callback={(response, status) => {
              if (status === "OK" && response) {
                setLegResults((prev) => (prev[key] ? prev : { ...prev, [key]: response }));
              }
            }}
          />
        );
      })}

      {consecutivePairs.map(([a, b]) => {
        const key = legKey(a, b, travelMode);
        const result = legResults[key];
        if (!result) return null;
        // suppressMarkers keeps Google's own A/B pins from appearing, so the
        // existing numbered Markers above stay the only pins on the map.
        return (
          <DirectionsRenderer
            key={key}
            directions={result}
            options={{ suppressMarkers: true }}
          />
        );
      })}
    </GoogleMap>
  );
}

export default function MapView({
  itinerary,
  travelMode = "DRIVING",
  onDirectionsChange,
  weatherByDestinationId = {},
}) {
  if (!itinerary || itinerary.length === 0) return null;

  if (!MAPS_API_KEY) {
    return (
      <div className="w-full h-56 sm:h-72 md:h-80 flex items-center justify-center text-sm text-gray-500 bg-stone-100 rounded-2xl border border-dashed border-stone-300">
        Map unavailable — set VITE_GOOGLE_MAPS_API_KEY in eco-tour/.env to enable it.
      </div>
    );
  }

  return (
    <div className="w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-md">
      <MapInner
        itinerary={itinerary}
        travelMode={travelMode}
        onDirectionsChange={onDirectionsChange}
        weatherByDestinationId={weatherByDestinationId}
      />
    </div>
  );
}

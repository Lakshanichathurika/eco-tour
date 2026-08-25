import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const CONTAINER_STYLE = { width: "100%", height: "100%" };
const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

function MapInner({ itinerary }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
  });

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

  const stopsWithCoordinates = itinerary.filter((stop) => stop.coordinates);
  const center = stopsWithCoordinates[0]?.coordinates || SRI_LANKA_CENTER;

  return (
    <GoogleMap mapContainerStyle={CONTAINER_STYLE} center={center} zoom={8}>
      {stopsWithCoordinates.map((stop) => (
        <Marker
          key={stop.visit_order}
          position={stop.coordinates}
          label={String(stop.visit_order)}
          title={stop.title}
        />
      ))}
    </GoogleMap>
  );
}

export default function MapView({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  if (!MAPS_API_KEY) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-sm text-gray-500 bg-stone-100 rounded-2xl border border-dashed border-stone-300">
        Map unavailable — set VITE_GOOGLE_MAPS_API_KEY in eco-tour/.env to enable it.
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden shadow-md">
      <MapInner itinerary={itinerary} />
    </div>
  );
}

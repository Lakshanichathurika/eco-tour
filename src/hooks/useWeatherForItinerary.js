import { useEffect, useState } from "react";
import { getWeather } from "../lib/api";

export default function useWeatherForItinerary(itinerary) {
  const [weatherByDestinationId, setWeatherByDestinationId] = useState({});

  useEffect(() => {
    (itinerary || []).forEach((stop) => {
      if (!stop.coordinates || weatherByDestinationId[stop.destination_id] !== undefined) {
        return;
      }
      setWeatherByDestinationId((prev) => ({ ...prev, [stop.destination_id]: "loading" }));
      getWeather(stop.coordinates.lat, stop.coordinates.lng)
        .then((data) =>
          setWeatherByDestinationId((prev) => ({ ...prev, [stop.destination_id]: data }))
        )
        .catch((err) =>
          setWeatherByDestinationId((prev) => ({
            ...prev,
            [stop.destination_id]: { error: err.message },
          }))
        );
    });
    // Only re-scan when a new itinerary loads — not on every state update,
    // so already-cached destinations aren't re-fetched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

  return weatherByDestinationId;
}

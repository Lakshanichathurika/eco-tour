// Vehicle-category transport cost estimation. A lookup/config object, not an
// if/else chain, so new vehicle types or rate revisions only touch VEHICLE_RATES,
// never the calculation logic below.
//
// Reference rates as of mid-2026 (Sri Lanka). Fuel prices and bus fares are
// revised periodically by government bodies — check ceypetco.gov.lk (fuel) and
// ntc.gov.lk (bus fares) before reusing these numbers beyond this project.
const VEHICLE_RATES = {
  car: { type: "fuel", efficiency_km_per_liter: 12, price_per_liter: 414 },
  bike: { type: "fuel", efficiency_km_per_liter: 45, price_per_liter: 414 },
  van: { type: "fuel", efficiency_km_per_liter: 10, price_per_liter: 382 },
  // Real NTC bus fares are set by a distance-stage table, not a flat per-km
  // rate. This is a documented approximation (minimum fare + an average per-km
  // rate for normal service) — not the actual stage table, which is out of
  // scope for this project.
  bus: { type: "fixed_rate", min_fare: 34, rate_per_km: 4.5 },
};

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Straight-line (haversine) distance between two {lat, lng} points.
function haversineDistanceKm(a, b) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// Total straight-line distance across consecutive itinerary stops that have
// coordinates. The itinerary has no existing distance/proximity logic to reuse —
// stops are ordered by recommendation score, not geography — so this is new.
// Straight-line, not real road distance: see the caller for the thesis note.
function calculateTotalDistanceKm(itinerary) {
  const stops = (itinerary || []).filter((stop) => stop.coordinates);
  let total = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    total += haversineDistanceKm(stops[i].coordinates, stops[i + 1].coordinates);
  }
  return total;
}

function calculateTransportCost(distanceKm, vehicleType) {
  const rate = VEHICLE_RATES[vehicleType] || VEHICLE_RATES.car;
  if (rate.type === "fuel") {
    return (distanceKm / rate.efficiency_km_per_liter) * rate.price_per_liter;
  }
  return Math.max(rate.min_fare, distanceKm * rate.rate_per_km);
}

module.exports = {
  VEHICLE_RATES,
  haversineDistanceKm,
  calculateTotalDistanceKm,
  calculateTransportCost,
};

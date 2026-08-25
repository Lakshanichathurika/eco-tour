const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export async function getDestinations() {
  const res = await fetch(`${API_BASE}/destinations`);
  if (!res.ok) throw new Error("Failed to fetch destinations");
  const json = await res.json();
  return json.data;
}

export async function getDestinationById(id) {
  const res = await fetch(`${API_BASE}/destinations/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch destination");
  const json = await res.json();
  return json.data;
}

export async function postRecommendations(payload) {
  const res = await fetch(`${API_BASE}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getWeather(lat, lng) {
  const res = await fetch(`${API_BASE}/weather?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch weather");
  return json.data;
}

export async function getNearbyRestStops(lat, lng) {
  const res = await fetch(`${API_BASE}/places/nearby?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch rest stops");
  return json.data;
}

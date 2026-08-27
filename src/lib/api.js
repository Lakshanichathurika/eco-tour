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

export async function getNearbyPlaces(lat, lng) {
  const res = await fetch(`${API_BASE}/places/nearby?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch nearby places");
  return json.data;
}

export async function saveTrip(payload) {
  const res = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to save trip");
  return json.data;
}

export async function getTrips(clientId) {
  const res = await fetch(`${API_BASE}/trips?client_id=${encodeURIComponent(clientId)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch trips");
  return json.data;
}

export async function getTripById(id, clientId) {
  const res = await fetch(`${API_BASE}/trips/${id}?client_id=${encodeURIComponent(clientId)}`);
  if (res.status === 404) return null;
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch trip");
  return json.data;
}

export async function deleteTrip(id) {
  const res = await fetch(`${API_BASE}/trips/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete trip");
  return json.data;
}

export async function signup(payload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.errors?.[0] || json.message || "Signup failed");
  return json.data;
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.errors?.[0] || json.message || "Login failed");
  return json.data;
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch user");
  return json.data;
}

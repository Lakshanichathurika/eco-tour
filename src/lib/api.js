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

export async function saveTrip(payload, token) {
  const res = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to save trip");
  return json.data;
}

export async function getTrips(token) {
  const res = await fetch(`${API_BASE}/trips`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch trips");
  return json.data;
}

export async function getTripById(id, token) {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch trip");
  return json.data;
}

export async function updateTrip(id, notes, token) {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ notes }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update trip");
  return json.data;
}

export async function deleteTrip(id, token) {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
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

export async function getDashboard(token) {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch dashboard");
  return json.data;
}

export async function saveDestination(destId, token) {
  const res = await fetch(`${API_BASE}/users/save-destination/${destId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to save destination");
  return json;
}

export async function unsaveDestination(destId, token) {
  const res = await fetch(`${API_BASE}/users/save-destination/${destId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to remove destination");
  return json;
}

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch profile");
  return json.data;
}

export async function updateProfile(payload, token) {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.errors?.[0] || json.message || "Failed to update profile");
  return json.data;
}

export async function changePassword(payload, token) {
  const res = await fetch(`${API_BASE}/users/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.errors?.[0] || json.message || "Failed to change password");
  return json;
}

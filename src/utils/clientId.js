// Anonymous, browser-local trip history — there's no real user auth yet, so trips
// are tied to this browser via localStorage, not an account. Clearing site data or
// switching browsers/devices loses history; real auth would be needed for
// cross-device sync (documented limitation, not solved here).
const CLIENT_ID_KEY = "eco_tour_client_id";

export function getClientId() {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  return clientId;
}

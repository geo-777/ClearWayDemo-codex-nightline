# MVP Plan – ClearWay

## Backend (Node.js + Express)

In-memory store (no database for MVP). Two maps: `ambulances` and `vehicles`, keyed by ID.

### Data Models

**Ambulance record**

```json
{
  "ambulanceId": "AMB-01",
  "lat": 0,
  "lng": 0,
  "speed": 0,
  "heading": 0,
  "active": true,
  "lastUpdatedAt": "2026-07-18T12:00:00Z"
}
```

**Vehicle record (optional, for logging/debugging only — detection is stateless per request)**

```json
{
  "vehicleId": "VEH-01",
  "lat": 0,
  "lng": 0,
  "heading": 0,
  "lastUpdatedAt": "2026-07-18T12:00:00Z"
}
```

### Endpoints

**`POST /ambulance/location`**
Request:

```json
{
  "ambulanceId": "AMB-01",
  "lat": 12.9716,
  "lng": 77.5946,
  "speed": 8.3,
  "heading": 90
}
```

- `speed` in **m/s**, `heading` in **degrees (0–360, 0 = North, clockwise)**.
- Creates the ambulance record if new, otherwise updates it and sets `active: true`, refreshes `lastUpdatedAt`.
- Response: `200 OK`, `{ "status": "ok" }`.
- Validation: reject if `lat`/`lng` out of range, `speed < 0`, or `heading` not in `[0,360)`. Return `400` with error body.

**`POST /vehicle/location`**
Request:

```json
{
  "vehicleId": "VEH-01",
  "lat": 12.972,
  "lng": 77.595,
  "heading": 270
}
```

- Runs detection against all `active` ambulances not stale (see staleness rule below).
- Returns the **single highest-priority alert** if multiple ambulances qualify (closest ETA wins), not just the first match.
- Response shapes:

```json
{
  "alert": true,
  "ambulanceId": "AMB-01",
  "distance": 182,
  "eta": 12,
  "severity": "high"
}
```

```json
{ "alert": false }
```

**`POST /ambulance/stop`**
Request: `{ "ambulanceId": "AMB-01" }`

- Sets `active: false`. Record is kept (not deleted) for potential debugging/history in this session, but excluded from detection.
- Response: `200 OK`, `{ "status": "stopped" }`. `404` if ambulance ID unknown.

**`GET /ambulances` (new — debug/demo utility)**

- Returns all ambulance records with current state. Useful for a future map UI or for verifying simulation state without opening two browser tabs side by side.

**`GET /health` (new)**

- Basic liveness check, `{ "status": "ok" }`. Trivial to add, useful for the demo and for the sim apps to confirm backend is up before starting.

---

## Detection Logic (fully specified)

For every vehicle location update, against each **active, non-stale** ambulance:

1. **Distance** — Haversine distance between vehicle and ambulance, in meters.
2. **Bearing check** — compute the bearing from the ambulance's position to the vehicle's position (`bearingToVehicle`). Compare it to the ambulance's reported `heading`. Compute the angular difference, normalized to `[0, 180]`. If the difference is within a tolerance (default **±45°**, configurable), the ambulance is considered "moving toward" the vehicle.
3. **ETA**:
   - `eta = distance / speed`, rounded to nearest second.
   - **If `speed` is 0 or below a minimum threshold (e.g. < 0.5 m/s, ambulance stopped at a light)**: skip the ETA divide-by-zero — instead treat as `eta: null` and either suppress the alert or flag severity as `"unknown"` (configurable; default: suppress, since a stationary ambulance isn't an imminent threat).
4. **Threshold check** — ambulance must be within `PROXIMITY_THRESHOLD_METERS` (config, default 300m) **and** pass the bearing check.
5. **Severity bands** (based on ETA, configurable):
   - `eta <= 10s` → `"high"`
   - `10s < eta <= 30s` → `"medium"`
   - `eta > 30s` → `"low"`
6. **Staleness rule** — if an ambulance's `lastUpdatedAt` is older than `STALE_THRESHOLD_MS` (config, default 5000ms — i.e. missed ~5 update cycles), exclude it from detection even if `active: true`. This handles crashed/closed sim tabs without requiring an explicit stop call.
7. **Multiple ambulances** — if more than one ambulance qualifies, return the one with the lowest ETA (most urgent). Only one alert is returned per vehicle update to keep the client simple.

All thresholds/config values live in a single `config.js` (or `.env`) so they're tunable without code changes during demo tuning.

---

## Frontend — Single Web App, Split-Screen Dashboard

Both simulations live in **one web app**, on **one page**, so judges see cause → effect without tabbing between windows. Layout:

```
┌─────────────────────────────────────────────┐
│                                               │
│              SHARED MAP (Leaflet)            │
│     🚑 ambulance marker   🚗 vehicle marker   │
│         proximity circle around vehicle       │
│                                               │
├───────────────────┬───────────────────────────┤
│  AMBULANCE PANEL    │      VEHICLE PANEL        │
│  Start / Stop        │  Start / Stop            │
│  Route: [dropdown]   │  Route: [dropdown]       │
│  Status: lat/lng,    │  ⚠️ ALERT BANNER          │
│  speed, heading       │  Distance / ETA / Sev.   │
│                       │  Raw JSON response       │
└───────────────────┴───────────────────────────┘
```

**Top bar**: a single **"Run Demo"** button that starts both simulations at once using the pre-set "converging" route pair — one click, guaranteed alert, no manual coordination needed mid-pitch. Individual Start/Stop buttons remain available per panel for manual/exploratory testing.

**Shared map (Leaflet + OpenStreetMap tiles — free, no API key required):**

- Two live markers: ambulance (red cross icon) and vehicle (blue car icon), re-rendered every second from the latest known positions.
  - Ambulance marker position: pulled from `GET /ambulances` (or from the ambulance panel's own local state, whichever is simpler to wire up first).
  - Vehicle marker position: the vehicle panel's own local state (it already knows its own position each tick).
- A **circle** drawn around the vehicle at radius `PROXIMITY_THRESHOLD_METERS`, so judges visually see the ambulance cross into the zone at the exact moment the alert fires.
- On alert: the circle pulses/flashes red in sync with the alert banner — this simultaneous visual + banner cue is the main "wow" moment for judges.

**Ambulance panel:**

- `ambulanceId` input (default `AMB-01`) so multiple ambulances could run if needed.
- Predefined route dropdown (converging / diverging / stationary — see test routes below).
- Every second: compute `heading` as bearing from current waypoint to next, compute `speed` as distance-to-next / 1s (derived from the route rather than hardcoded, for realism), POST to `/ambulance/location`.
- Loop back to the first waypoint on reaching the end, so the demo can run indefinitely without judges needing to restart it.
- "Stop" calls `POST /ambulance/stop` explicitly, then halts the interval.
- Status readout: current waypoint index, lat/lng, speed, heading, last response status.

**Vehicle panel:**

- `vehicleId` input (default `VEH-01`).
- Predefined route dropdown, same waypoint-to-heading derivation.
- Every second: POST to `/vehicle/location`, display the raw JSON response (useful for technical judges verifying it's a real live call, not staged).
- **Alert banner**: prominent, color-coded by severity (red = high, orange = medium, yellow = low), shows ambulance ID, distance (m), ETA (s). Clears automatically on the next `alert: false` response.
- Optional: a short audio beep on the no-alert → alert transition, for extra demo impact.

Both panels run their own independent 1-second interval and call their respective endpoints directly — they don't need to know about each other; the backend is what correlates them. The map is simply a shared visualization layer reading from both panels' state (and/or `GET /ambulances`).

---

## Simulation Approach

Both apps replay predefined coordinate paths through the exact same production API contract — no mocked responses, no shortcuts. This keeps the detection algorithm and the client integration both genuinely exercised, so the demo proves real end-to-end behavior, not a scripted mock.

Suggested test routes for the demo:

- **Converging route**: ambulance and vehicle paths cross paths with the ambulance heading toward the vehicle — should trigger alert.
- **Diverging route**: ambulance moving away — should NOT trigger despite proximity (validates bearing check).
- **Stationary ambulance**: parked at a light near the vehicle's path — validates the speed=0 handling.
- **Two ambulances**: one closer with higher ETA, one farther with lower ETA — validates the "most urgent wins" tie-break.

---

## Scope

- No authentication
- No database (in-memory only; state resets on server restart — acceptable for MVP)
- No WebSockets (stateless request/response per update is sufficient at 1 update/sec)
- No real GPS
- No map UI (optional, if time permits — `GET /ambulances` is designed to make this easy to bolt on later)
- No persistence across restarts
- No multi-tenant support (single in-memory instance, single demo session)

## Explicit Non-Goals (documented so they're not silently assumed later)

- No road-snapping/routing — straight-line Haversine only, so ETA is a rough lower bound, not a real ETA.
- No traffic or historical speed modeling.
- No retry/backoff logic on the sim clients if a POST fails — a failed tick is just logged and skipped.
- No rate limiting or abuse protection on the API (fine for local demo; flag before any public deployment).

## Suggested Build Order

1. Backend: data models + Haversine/bearing utils (unit-testable in isolation).
2. Backend: three core endpoints + config file.
3. Backend: staleness check + severity bands.
4. Ambulance sim app (simplest, no response handling needed beyond status).
5. Vehicle sim app + alert banner.
6. Run the four test routes above to validate the algorithm end-to-end.
7. (Optional) `GET /ambulances` + minimal map overlay if time remains.

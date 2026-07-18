import { useState } from 'react';
import { postAmbulanceLocation, postAmbulanceStop } from '../api/client.js';
import { ROUTE_SETS } from '../data/testRoutes.js';
import useSimulation from '../hooks/useSimulation.js';

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceBetween(start, end) {
  const deltaLat = toRadians(end.lat - start.lat);
  const deltaLng = toRadians(end.lng - start.lng);
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function AmbulancePanel({ onPositionUpdate }) {
  const [ambulanceId, setAmbulanceId] = useState('AMB-01');
  const [selectedRoute, setSelectedRoute] = useState('converging');
  const [speed, setSpeed] = useState(null);
  const [lastResponse, setLastResponse] = useState('—');
  const route = ROUTE_SETS[selectedRoute].ambulance;

  const { isRunning, start, stop, currentIndex, currentPosition, currentHeading } = useSimulation(
    route,
    async (position, heading, waypointIndex) => {
      const nextPosition = route[(waypointIndex + 1) % route.length];
      const currentSpeed = distanceBetween(position, nextPosition);

      setSpeed(currentSpeed);
      onPositionUpdate?.(position, heading);

      try {
        const response = await postAmbulanceLocation({
          ambulanceId,
          lat: position.lat,
          lng: position.lng,
          speed: currentSpeed,
          heading,
        });
        setLastResponse(response.status || 'ok');
      } catch (error) {
        setLastResponse(error.message);
      }
    },
  );

  async function handleStop() {
    stop();

    try {
      const response = await postAmbulanceStop({ ambulanceId });
      setLastResponse(response.status || 'stopped');
    } catch (error) {
      setLastResponse(error.message);
    }
  }

  return (
    <article className="simulation-panel ambulance-panel">
      <h2>🚑 Ambulance Simulation</h2>

      <label className="form-field" htmlFor="ambulance-id">
        Ambulance ID
        <input
          id="ambulance-id"
          type="text"
          value={ambulanceId}
          disabled={isRunning}
          onChange={(event) => setAmbulanceId(event.target.value)}
        />
      </label>

      <label className="form-field" htmlFor="ambulance-route">
        Route
        <select
          id="ambulance-route"
          value={selectedRoute}
          disabled={isRunning}
          onChange={(event) => setSelectedRoute(event.target.value)}
        >
          {Object.keys(ROUTE_SETS).map((routeName) => (
            <option key={routeName} value={routeName}>
              {routeName.charAt(0).toUpperCase() + routeName.slice(1)} Route
            </option>
          ))}
        </select>
      </label>

      <div className="button-row">
        <button type="button" disabled={isRunning} onClick={start}>Start</button>
        <button className="stop-button" type="button" disabled={!isRunning} onClick={handleStop}>Stop</button>
      </div>

      <section className="status-readout" aria-label="Ambulance status">
        <h3>Status</h3>
        <p>Waypoint: {isRunning ? currentIndex : '—'}</p>
        <p>
          Lat/Lng: {currentPosition && isRunning
            ? `${currentPosition.lat.toFixed(5)}, ${currentPosition.lng.toFixed(5)}`
            : '—'}
        </p>
        <p>Speed: {speed === null || !isRunning ? '—' : `${Math.round(speed)} m/s`}</p>
        <p>Heading: {currentHeading === null || !isRunning ? '—' : `${Math.round(currentHeading)}°`}</p>
        <p>Last response: {lastResponse}</p>
      </section>
    </article>
  );
}

export default AmbulancePanel;

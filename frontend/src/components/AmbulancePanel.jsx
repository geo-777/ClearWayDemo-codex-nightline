import { useEffect, useRef, useState } from 'react';
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

function AmbulancePanel({ onPositionUpdate, selectedRoute, simulationCommand }) {
  const [speed, setSpeed] = useState(null);
  const [lastResponse, setLastResponse] = useState('—');
  const lastCommandId = useRef(null);
  const stopRequestRef = useRef(Promise.resolve());
  const ambulanceId = 'AMB-01';
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

  useEffect(() => {
    if (!simulationCommand || simulationCommand.id === lastCommandId.current) {
      return;
    }

    lastCommandId.current = simulationCommand.id;

    if (simulationCommand.action === 'start' && !isRunning) {
      stopRequestRef.current.then(() => start());
    }

    if (simulationCommand.action === 'stop' && isRunning) {
      stop();
      stopRequestRef.current = postAmbulanceStop({ ambulanceId })
        .then((response) => setLastResponse(response.status || 'stopped'))
        .catch((error) => {
          setLastResponse(error.message);
        });
    }
  }, [simulationCommand]);

  return (
    <article className="simulation-panel ambulance-panel">
      <div className="panel-heading">
        <img src="/ambulance-marker.svg" alt="" className="panel-icon" />
        <div>
          <p className="panel-eyebrow">Emergency unit</p>
          <h2>Ambulance status</h2>
        </div>
        <span className={`live-indicator ${isRunning ? 'is-live' : ''}`}>
          {isRunning ? 'Live' : 'Idle'}
        </span>
      </div>

      <section className="status-readout" aria-label="Ambulance status">
        <p>Unit ID: <strong>{ambulanceId}</strong></p>
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

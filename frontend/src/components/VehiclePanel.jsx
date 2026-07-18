import { useEffect, useRef, useState } from 'react';
import { postVehicleLocation } from '../api/client.js';
import { ROUTE_SETS } from '../data/testRoutes.js';
import useSimulation from '../hooks/useSimulation.js';
import AlertBanner from './AlertBanner.jsx';

function VehiclePanel({ onPositionUpdate, onAlertUpdate, selectedRoute, simulationCommand }) {
  const [alertData, setAlertData] = useState(null);
  const [rawResponse, setRawResponse] = useState('No data yet');
  const lastCommandId = useRef(null);
  const vehicleId = 'VEH-01';
  const route = ROUTE_SETS[selectedRoute].vehicle;

  const { isRunning, start, stop, currentIndex, currentPosition, currentHeading } = useSimulation(
    route,
    async (position, heading) => {
      onPositionUpdate?.(position);

      try {
        const response = await postVehicleLocation({
          vehicleId,
          lat: position.lat,
          lng: position.lng,
          heading,
        });
        setAlertData(response);
        onAlertUpdate?.(response);
        setRawResponse(JSON.stringify(response, null, 2));
      } catch (error) {
        setAlertData(null);
        onAlertUpdate?.(null);
        setRawResponse(`Error: ${error.message}`);
      }
    },
  );

  useEffect(() => {
    if (!simulationCommand || simulationCommand.id === lastCommandId.current) {
      return;
    }

    lastCommandId.current = simulationCommand.id;

    if (simulationCommand.action === 'start' && !isRunning) {
      start();
    }

    if (simulationCommand.action === 'stop') {
      if (isRunning) {
        stop();
      }
      setAlertData(null);
      onAlertUpdate?.(null);
      setRawResponse('No data yet');
    }
  }, [simulationCommand]);

  return (
    <article className="simulation-panel vehicle-panel">
      <div className="panel-heading">
        <img src="/vehicle-marker.svg" alt="" className="panel-icon" />
        <div>
          <p className="panel-eyebrow">Driver view</p>
          <h2>Vehicle status</h2>
        </div>
        <span className={`live-indicator ${isRunning ? 'is-live' : ''}`}>
          {isRunning ? 'Live' : 'Idle'}
        </span>
      </div>

      <section className="status-readout vehicle-location" aria-label="Vehicle location status">
        <p>Vehicle ID: <strong>{vehicleId}</strong></p>
        <p>Waypoint: {isRunning ? currentIndex : '—'}</p>
        <p>
          Coordinates: {currentPosition && isRunning
            ? `${currentPosition.lat.toFixed(5)}, ${currentPosition.lng.toFixed(5)}`
            : '—'}
        </p>
        <p>Heading: {currentHeading === null || !isRunning ? '—' : `${Math.round(currentHeading)}°`}</p>
      </section>

      <AlertBanner alertData={alertData} />

      <section className="raw-response" aria-label="Raw response">
        <h3>Raw response</h3>
        <pre>{rawResponse}</pre>
      </section>
    </article>
  );
}

export default VehiclePanel;

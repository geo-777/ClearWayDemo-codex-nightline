import { useEffect, useRef, useState } from 'react';
import { postVehicleLocation } from '../api/client.js';
import { ROUTE_SETS } from '../data/testRoutes.js';
import useSimulation from '../hooks/useSimulation.js';
import AlertBanner from './AlertBanner.jsx';

function VehiclePanel({ onPositionUpdate, onAlertUpdate, triggerRunId }) {
  const [vehicleId, setVehicleId] = useState('VEH-01');
  const [selectedRoute, setSelectedRoute] = useState('converging');
  const [alertData, setAlertData] = useState(null);
  const [rawResponse, setRawResponse] = useState('No data yet');
  const [pendingDemoRun, setPendingDemoRun] = useState(false);
  const lastTriggerRunId = useRef(null);
  const route = ROUTE_SETS[selectedRoute].vehicle;

  const { isRunning, start, stop } = useSimulation(
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
    if (triggerRunId == null || triggerRunId === lastTriggerRunId.current) {
      return;
    }

    lastTriggerRunId.current = triggerRunId;

    if (!isRunning) {
      setVehicleId('VEH-01');
      setSelectedRoute('converging');
      setPendingDemoRun(true);
    }
  }, [triggerRunId]);

  useEffect(() => {
    if (pendingDemoRun && selectedRoute === 'converging' && !isRunning) {
      start();
      setPendingDemoRun(false);
    }
  }, [isRunning, pendingDemoRun, selectedRoute, start]);

  return (
    <article className="simulation-panel vehicle-panel">
      <h2>🚗 Vehicle Simulation</h2>

      <label className="form-field" htmlFor="vehicle-id">
        Vehicle ID
        <input
          id="vehicle-id"
          type="text"
          value={vehicleId}
          disabled={isRunning}
          onChange={(event) => setVehicleId(event.target.value)}
        />
      </label>

      <label className="form-field" htmlFor="vehicle-route">
        Route
        <select
          id="vehicle-route"
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
        <button className="stop-button" type="button" disabled={!isRunning} onClick={stop}>Stop</button>
      </div>

      <AlertBanner alertData={alertData} />

      <section className="raw-response" aria-label="Raw response">
        <h3>Raw response</h3>
        <pre>{rawResponse}</pre>
      </section>
    </article>
  );
}

export default VehiclePanel;

import AlertBanner from './AlertBanner.jsx';

function VehiclePanel() {
  return (
    <article className="simulation-panel vehicle-panel">
      <h2>🚗 Vehicle Simulation</h2>

      <label className="form-field" htmlFor="vehicle-id">
        Vehicle ID
        <input id="vehicle-id" type="text" defaultValue="VEH-01" />
      </label>

      <label className="form-field" htmlFor="vehicle-route">
        Route
        <select id="vehicle-route" defaultValue="converging">
          <option value="converging">Converging Route</option>
          <option value="diverging">Diverging Route</option>
          <option value="stationary">Stationary Route</option>
        </select>
      </label>

      <div className="button-row">
        <button type="button">Start</button>
        <button className="stop-button" type="button">Stop</button>
      </div>

      <AlertBanner />

      <section className="raw-response" aria-label="Raw response">
        <h3>Raw response</h3>
        <pre>No data yet</pre>
      </section>
    </article>
  );
}

export default VehiclePanel;

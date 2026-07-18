function AmbulancePanel() {
  return (
    <article className="simulation-panel ambulance-panel">
      <h2>🚑 Ambulance Simulation</h2>

      <label className="form-field" htmlFor="ambulance-id">
        Ambulance ID
        <input id="ambulance-id" type="text" defaultValue="AMB-01" />
      </label>

      <label className="form-field" htmlFor="ambulance-route">
        Route
        <select id="ambulance-route" defaultValue="converging">
          <option value="converging">Converging Route</option>
          <option value="diverging">Diverging Route</option>
          <option value="stationary">Stationary Route</option>
        </select>
      </label>

      <div className="button-row">
        <button type="button">Start</button>
        <button className="stop-button" type="button">Stop</button>
      </div>

      <section className="status-readout" aria-label="Ambulance status">
        <h3>Status</h3>
        <p>Waypoint: —</p>
        <p>Lat/Lng: —</p>
        <p>Speed: — m/s</p>
        <p>Heading: —°</p>
        <p>Last response: —</p>
      </section>
    </article>
  );
}

export default AmbulancePanel;

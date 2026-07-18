import { useState } from "react";
import RunDemoButton from "./components/RunDemoButton.jsx";
import MapView from "./components/MapView.jsx";
import AmbulancePanel from "./components/AmbulancePanel.jsx";
import VehiclePanel from "./components/VehiclePanel.jsx";
import "./styles/App.css";

const ROUTE_LABELS = {
  converging: "Converging",
  diverging: "Diverging",
  stationary: "Stationary",
  sameDirection: "Overtake",
};

function App() {
  const [ambulancePosition, setAmbulancePosition] = useState(null);
  const [ambulanceHeading, setAmbulanceHeading] = useState(null);
  const [vehiclePosition, setVehiclePosition] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState("converging");
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [simulationCommand, setSimulationCommand] = useState(null);

  function handleDemoToggle() {
    const action = isDemoRunning ? "stop" : "start";
    setSimulationCommand({ id: Date.now(), action });
    setIsDemoRunning(action === "start");

    if (action === "stop") {
      setAlertData(null);
    }
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <img src="/clearway-logo.svg" alt="" />
          </div>
          <div>
            <p className="brand-kicker">Every Second Matters</p>{" "}
            <h1>
              ClearWay System <span>Live Demo</span>
            </h1>
          </div>
        </div>

        <div className="top-bar-controls">
          <div className={`system-state ${isDemoRunning ? "is-live" : ""}`}>
            <span className="system-state-dot" />
            {isDemoRunning ? "Simulation live" : "System ready"}
          </div>
          <label className="scenario-control" htmlFor="demo-route">
            <span>Scenario</span>
            <select
              id="demo-route"
              value={selectedRoute}
              disabled={isDemoRunning}
              onChange={(event) => setSelectedRoute(event.target.value)}
            >
              <option value="converging">Converging Route</option>
              <option value="diverging">Diverging Route</option>
              <option value="stationary">Stationary Route</option>
              <option value="sameDirection">Same Direction - Overtake</option>
            </select>
          </label>
          <RunDemoButton
            isRunning={isDemoRunning}
            onToggle={handleDemoToggle}
          />
        </div>
      </header>

      <section className="dashboard-layout" aria-label="Live demo dashboard">
        <aside className="controls-column" aria-label="Simulation status">
          <div className="controls-heading">
            <div>
              <p className="section-kicker">Operations console</p>
              <h2>Live telemetry</h2>
            </div>
            <span className="route-chip">{ROUTE_LABELS[selectedRoute]}</span>
          </div>
          <AmbulancePanel
            selectedRoute={selectedRoute}
            simulationCommand={simulationCommand}
            onPositionUpdate={(position, heading) => {
              setAmbulancePosition(position);
              setAmbulanceHeading(heading);
            }}
          />
          <VehiclePanel
            selectedRoute={selectedRoute}
            simulationCommand={simulationCommand}
            onPositionUpdate={setVehiclePosition}
            onAlertUpdate={setAlertData}
          />
        </aside>

        <section className="map-section" aria-label="Map area">
          <MapView
            ambulancePosition={ambulancePosition}
            vehiclePosition={vehiclePosition}
            alertData={alertData}
          />
          <div className="map-hud map-hud-live" aria-hidden="true">
            <span className="map-hud-dot" />
            Live location feed
          </div>
          <div className="map-hud map-hud-radius" aria-hidden="true">
            <strong>300m</strong>
            <span>alert radius</span>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;

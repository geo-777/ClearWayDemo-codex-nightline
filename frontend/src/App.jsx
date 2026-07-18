import { useState } from "react";
import RunDemoButton from "./components/RunDemoButton.jsx";
import MapView from "./components/MapView.jsx";
import AmbulancePanel from "./components/AmbulancePanel.jsx";
import VehiclePanel from "./components/VehiclePanel.jsx";
import "./styles/App.css";

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
        <h1>ClearWay System — Live Demo</h1>
        <div className="top-bar-controls">
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
        </section>
      </section>
    </main>
  );
}

export default App;

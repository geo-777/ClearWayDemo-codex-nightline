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
  const [triggerRunId, setTriggerRunId] = useState(null);

  const handleRunDemo = () => setTriggerRunId(Date.now());

  return (
    <main className="app-shell">
      <header className="top-bar">
        <h1>ClearWay — Ambulance Proximity Live Demo</h1>
        <RunDemoButton onRunDemo={handleRunDemo} />
      </header>

      <section className="map-section" aria-label="Map area">
        <MapView
          ambulancePosition={ambulancePosition}
          vehiclePosition={vehiclePosition}
          alertData={alertData}
        />
      </section>

      <section className="simulation-grid" aria-label="Simulation controls">
        <AmbulancePanel
          triggerRunId={triggerRunId}
          onPositionUpdate={(position, heading) => {
            setAmbulancePosition(position);
            setAmbulanceHeading(heading);
          }}
        />
        <VehiclePanel
          triggerRunId={triggerRunId}
          onPositionUpdate={setVehiclePosition}
          onAlertUpdate={setAlertData}
        />
      </section>
    </main>
  );
}

export default App;

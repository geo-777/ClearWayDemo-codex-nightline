import RunDemoButton from "./components/RunDemoButton.jsx";
import MapView from "./components/MapView.jsx";
import AmbulancePanel from "./components/AmbulancePanel.jsx";
import VehiclePanel from "./components/VehiclePanel.jsx";
import "./styles/App.css";

function App() {
  return (
    <main className="app-shell">
      <header className="top-bar">
        <h1>ClearWay — Ambulance Proximity Live Demo</h1>
        <RunDemoButton />
      </header>

      <section className="map-section" aria-label="Map area">
        <MapView />
      </section>

      <section className="simulation-grid" aria-label="Simulation controls">
        <AmbulancePanel />
        <VehiclePanel />
      </section>
    </main>
  );
}

export default App;

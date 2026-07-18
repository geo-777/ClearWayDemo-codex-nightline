import L from 'leaflet';
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PROXIMITY_THRESHOLD_METERS = 300;
const DEFAULT_CENTER = [11.2601965, 75.7682925];
const OPEN_STREET_MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const SEVERITY_COLORS = {
  high: '#dc2626',
  medium: '#ea580c',
  low: '#eab308',
};

const ambulanceIcon = L.icon({
  iconUrl: '/ambulance-marker.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const vehicleIcon = L.icon({
  iconUrl: '/vehicle-marker.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function MapView({ ambulancePosition, vehiclePosition, alertData }) {
  const isAlert = Boolean(alertData?.alert);
  const circleColor = isAlert
    ? SEVERITY_COLORS[alertData.severity] || SEVERITY_COLORS.low
    : '#64748b';

  return (
    <>
      <style>{`
        @keyframes proximity-circle-pulse {
          50% { stroke-width: 7px; stroke-opacity: 0.95; fill-opacity: 0.28; }
        }
        .proximity-circle-pulse { animation: proximity-circle-pulse 1.1s ease-in-out infinite; }
      `}</style>
      <MapContainer center={DEFAULT_CENTER} zoom={16} scrollWheelZoom style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={OPEN_STREET_MAP_URL}
        />
        {ambulancePosition && <Marker position={[ambulancePosition.lat, ambulancePosition.lng]} icon={ambulanceIcon} />}
        {vehiclePosition && (
          <>
            <Marker position={[vehiclePosition.lat, vehiclePosition.lng]} icon={vehicleIcon} />
            <Circle
              center={[vehiclePosition.lat, vehiclePosition.lng]}
              radius={PROXIMITY_THRESHOLD_METERS}
              className={isAlert ? 'proximity-circle-pulse' : undefined}
              pathOptions={{
                color: circleColor,
                fillColor: circleColor,
                fillOpacity: isAlert ? 0.2 : 0.08,
                opacity: isAlert ? 0.9 : 0.65,
                weight: isAlert ? 4 : 2,
              }}
            />
          </>
        )}
      </MapContainer>
    </>
  );
}

export default MapView;

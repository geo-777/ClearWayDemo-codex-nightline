const BASE_URL = 'http://localhost:3001';

async function request(path, options) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.error || `Backend request failed with status ${response.status}`);
    }

    return body;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Failed to reach backend — is the server running?');
    }

    throw error;
  }
}

export async function postAmbulanceLocation({ ambulanceId, lat, lng, speed, heading }) {
  return request('/ambulance/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ambulanceId, lat, lng, speed, heading }),
  });
}

export async function postAmbulanceStop({ ambulanceId }) {
  return request('/ambulance/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ambulanceId }),
  });
}

export async function getAmbulances() {
  return request('/ambulances');
}

export async function postVehicleLocation({ vehicleId, lat, lng, heading }) {
  return request('/vehicle/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicleId, lat, lng, heading }),
  });
}

const ambulances = new Map();
const vehicles = new Map();

function upsertAmbulance({ ambulanceId, lat, lng, speed, heading }) {
  const record = {
    ambulanceId,
    lat,
    lng,
    speed,
    heading,
    active: true,
    lastUpdatedAt: new Date().toISOString(),
  };

  ambulances.set(ambulanceId, record);
  return record;
}

function stopAmbulance(ambulanceId) {
  const record = ambulances.get(ambulanceId);

  if (!record) {
    return null;
  }

  const updatedRecord = { ...record, active: false };
  ambulances.set(ambulanceId, updatedRecord);
  return updatedRecord;
}

function getAllAmbulances() {
  return Array.from(ambulances.values());
}

function getActiveAmbulances() {
  return getAllAmbulances().filter((ambulance) => ambulance.active === true);
}

function upsertVehicle({ vehicleId, lat, lng, heading }) {
  const record = {
    vehicleId,
    lat,
    lng,
    heading,
    lastUpdatedAt: new Date().toISOString(),
  };

  vehicles.set(vehicleId, record);
  return record;
}

module.exports = {
  upsertAmbulance,
  stopAmbulance,
  getAllAmbulances,
  getActiveAmbulances,
  upsertVehicle,
};

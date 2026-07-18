export const convergingAmbulanceRoute = [
  { lat: 12.9700, lng: 77.5946 }, { lat: 12.97012, lng: 77.5946 },
  { lat: 12.97024, lng: 77.5946 }, { lat: 12.97036, lng: 77.5946 },
  { lat: 12.97048, lng: 77.5946 }, { lat: 12.9706, lng: 77.5946 },
  { lat: 12.97072, lng: 77.5946 }, { lat: 12.97084, lng: 77.5946 },
  { lat: 12.97096, lng: 77.5946 }, { lat: 12.97108, lng: 77.5946 },
  { lat: 12.9712, lng: 77.5946 }, { lat: 12.97132, lng: 77.5946 },
];

export const convergingVehicleRoute = [
  { lat: 12.9724, lng: 77.5946 }, { lat: 12.97228, lng: 77.5946 },
  { lat: 12.97216, lng: 77.5946 }, { lat: 12.97204, lng: 77.5946 },
  { lat: 12.97192, lng: 77.5946 }, { lat: 12.9718, lng: 77.5946 },
  { lat: 12.97168, lng: 77.5946 }, { lat: 12.97156, lng: 77.5946 },
  { lat: 12.97144, lng: 77.5946 }, { lat: 12.97132, lng: 77.5946 },
  { lat: 12.9712, lng: 77.5946 }, { lat: 12.97108, lng: 77.5946 },
];

export const divergingAmbulanceRoute = [
  { lat: 12.972, lng: 77.596 }, { lat: 12.97188, lng: 77.596 },
  { lat: 12.97176, lng: 77.596 }, { lat: 12.97164, lng: 77.596 },
  { lat: 12.97152, lng: 77.596 }, { lat: 12.9714, lng: 77.596 },
  { lat: 12.97128, lng: 77.596 }, { lat: 12.97116, lng: 77.596 },
  { lat: 12.97104, lng: 77.596 }, { lat: 12.97092, lng: 77.596 },
  { lat: 12.9708, lng: 77.596 }, { lat: 12.97068, lng: 77.596 },
];

export const divergingVehicleRoute = [
  { lat: 12.97236, lng: 77.596 }, { lat: 12.97248, lng: 77.596 },
  { lat: 12.9726, lng: 77.596 }, { lat: 12.97272, lng: 77.596 },
  { lat: 12.97284, lng: 77.596 }, { lat: 12.97296, lng: 77.596 },
  { lat: 12.97308, lng: 77.596 }, { lat: 12.9732, lng: 77.596 },
  { lat: 12.97332, lng: 77.596 }, { lat: 12.97344, lng: 77.596 },
  { lat: 12.97356, lng: 77.596 }, { lat: 12.97368, lng: 77.596 },
];

export const stationaryAmbulanceRoute = [
  { lat: 12.974, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
  { lat: 12.974, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
  { lat: 12.974, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
  { lat: 12.974, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
  { lat: 12.974, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
  { lat: 12.974, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
];

export const stationaryVehicleRoute = [
  { lat: 12.9734, lng: 77.593 }, { lat: 12.97352, lng: 77.593 },
  { lat: 12.97364, lng: 77.593 }, { lat: 12.97376, lng: 77.593 },
  { lat: 12.97388, lng: 77.593 }, { lat: 12.974, lng: 77.593 },
  { lat: 12.97412, lng: 77.593 }, { lat: 12.97424, lng: 77.593 },
  { lat: 12.97436, lng: 77.593 }, { lat: 12.97448, lng: 77.593 },
  { lat: 12.9746, lng: 77.593 }, { lat: 12.97472, lng: 77.593 },
];

export const ROUTE_SETS = {
  converging: { ambulance: convergingAmbulanceRoute, vehicle: convergingVehicleRoute },
  diverging: { ambulance: divergingAmbulanceRoute, vehicle: divergingVehicleRoute },
  stationary: { ambulance: stationaryAmbulanceRoute, vehicle: stationaryVehicleRoute },
};

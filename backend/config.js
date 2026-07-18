module.exports = {
  // Maximum ambulance-to-vehicle distance that can qualify for an alert.
  PROXIMITY_THRESHOLD_METERS: 300,
  // Maximum age of an ambulance location update before it is treated as stale.
  STALE_THRESHOLD_MS: 5000,
  // Maximum heading difference for an ambulance to be considered moving toward a vehicle.
  BEARING_TOLERANCE_DEGREES: 45,
  // Minimum ambulance speed; lower speeds are treated as stationary and suppress alerts.
  MIN_AMBULANCE_SPEED_MPS: 0.5,
  // Largest ETA that receives high alert severity.
  SEVERITY_ETA_HIGH_MAX_SECONDS: 10,
  // Largest ETA above high severity that receives medium alert severity.
  SEVERITY_ETA_MEDIUM_MAX_SECONDS: 30,
};

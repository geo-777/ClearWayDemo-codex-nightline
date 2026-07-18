const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculates the distance in meters between two latitude/longitude coordinates.
 * @param {number} lat1 Starting latitude; @param {number} lng1 Starting longitude; @param {number} lat2 Ending latitude; @param {number} lng2 Ending longitude.
 * @returns {number} Distance in meters.
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const startLat = toRadians(lat1);
  const endLat = toRadians(lat2);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) ** 2;
  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * centralAngle;
}

/**
 * Calculates the initial compass bearing from one latitude/longitude coordinate to another.
 * @param {number} lat1 Starting latitude; @param {number} lng1 Starting longitude; @param {number} lat2 Ending latitude; @param {number} lng2 Ending longitude.
 * @returns {number} Bearing in degrees in the range [0, 360).
 */
function bearing(lat1, lng1, lat2, lng2) {
  const startLat = toRadians(lat1);
  const endLat = toRadians(lat2);
  const deltaLng = toRadians(lng2 - lng1);

  const y = Math.sin(deltaLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng);
  const degrees = (Math.atan2(y, x) * 180) / Math.PI;

  return (degrees + 360) % 360;
}

/**
 * Finds the smallest angular separation between two compass bearings.
 * @param {number} bearingA First bearing; @param {number} bearingB Second bearing.
 * @returns {number} Angle in degrees in the range [0, 180].
 */
function angularDifference(bearingA, bearingB) {
  return Math.abs(((bearingA - bearingB + 540) % 360) - 180);
}

module.exports = { haversineDistance, bearing, angularDifference };

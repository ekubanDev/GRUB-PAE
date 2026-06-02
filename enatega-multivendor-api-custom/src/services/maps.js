const { Client } = require('@googlemaps/google-maps-services-js')

const client = new Client({})

/**
 * Geocode an address string to lat/lng coordinates.
 */
async function geocodeAddress(address) {
  const response = await client.geocode({
    params: {
      address,
      key: process.env.GOOGLE_MAPS_API_KEY,
      region: 'GH' // bias results toward Ghana
    }
  })
  const result = response.data.results[0]
  if (!result) return null
  const { lat, lng } = result.geometry.location
  return { latitude: lat, longitude: lng, formattedAddress: result.formatted_address }
}

/**
 * Calculate driving distance and duration between two points.
 * Returns { distanceMeters, durationSeconds }
 */
async function getDistanceAndDuration(origin, destination) {
  const response = await client.distancematrix({
    params: {
      origins: [`${origin.latitude},${origin.longitude}`],
      destinations: [`${destination.latitude},${destination.longitude}`],
      mode: 'driving',
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  })
  const element = response.data.rows[0]?.elements[0]
  if (!element || element.status !== 'OK') return null
  return {
    distanceMeters: element.distance.value,
    durationSeconds: element.duration.value
  }
}

/**
 * Check if a point [lng, lat] is inside a GeoJSON Polygon.
 * Used to validate delivery zone membership.
 */
function pointInPolygon(point, polygon) {
  const [x, y] = point
  const vs = polygon[0]
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1]
    const xj = vs[j][0], yj = vs[j][1]
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

module.exports = { geocodeAddress, getDistanceAndDuration, pointInPolygon }

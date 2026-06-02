const jwt = require('jsonwebtoken')
const { verifyToken } = require('../services/firebase')

/**
 * Extracts and verifies the caller identity from an incoming GraphQL request.
 * Supports two token types:
 *   1. Firebase ID tokens (from mobile apps / web)
 *   2. Internal JWTs (issued by this API after login)
 *
 * The result is attached to `context.user` in Apollo Server context.
 * Returns null without throwing — resolvers decide if auth is required.
 */
async function getContextUser(req) {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)

  // Try internal JWT first (fast, no network call)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { userId: decoded.userId, userType: decoded.userType, _id: decoded.userId }
  } catch {
    // Not a JWT — fall through to Firebase
  }

  // Try Firebase ID token
  try {
    const decoded = await verifyToken(token)
    return { userId: decoded.uid, userType: 'firebase', firebaseUid: decoded.uid, email: decoded.email, phone: decoded.phone_number }
  } catch {
    return null
  }
}

function requireAuth(user) {
  if (!user) throw new Error('Unauthenticated')
}

function requireAdmin(user) {
  if (!user || user.userType !== 'admin') throw new Error('Unauthorized')
}

module.exports = { getContextUser, requireAuth, requireAdmin }

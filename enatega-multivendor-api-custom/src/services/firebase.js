const admin = require('firebase-admin')

let initialized = false

function initFirebase() {
  if (initialized) return
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines in private key (common issue with env vars)
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
  initialized = true
}

/**
 * Verify a Firebase ID token from a client request.
 * Returns the decoded token payload (uid, email, phone_number, etc.)
 */
async function verifyToken(idToken) {
  initFirebase()
  return admin.auth().verifyIdToken(idToken)
}

/**
 * Send a push notification to a single device token.
 */
async function sendPushNotification({ token, title, body, data = {} }) {
  initFirebase()
  if (!token) return null
  const message = {
    notification: { title, body },
    data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    token
  }
  return admin.messaging().send(message)
}

/**
 * Send push notifications to multiple device tokens (batch, max 500).
 */
async function sendMulticastNotification({ tokens, title, body, data = {} }) {
  initFirebase()
  if (!tokens?.length) return null
  const message = {
    notification: { title, body },
    data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    tokens
  }
  return admin.messaging().sendEachForMulticast(message)
}

module.exports = { verifyToken, sendPushNotification, sendMulticastNotification, initFirebase }

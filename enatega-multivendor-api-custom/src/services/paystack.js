const axios = require('axios')
const crypto = require('crypto')

const PAYSTACK_BASE = 'https://api.paystack.co'

const headers = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json'
})

/**
 * Initialize a Paystack transaction.
 * Returns { authorization_url, access_code, reference }
 * Currency defaults to GHS (Ghana Cedis) — GRUB-PAE primary market.
 */
async function initializeTransaction({ email, amount, currency = 'GHS', metadata = {} }) {
  // Paystack expects amount in kobo/pesewas (smallest unit) — multiply by 100
  const response = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      email,
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        ...metadata,
        mobile_money_eligible: true // enables mobile money on Paystack checkout
      }
    },
    { headers: headers() }
  )
  return response.data.data
}

/**
 * Verify a Paystack transaction by reference.
 * Returns the full transaction object.
 * Always verify server-side — never trust client-reported status.
 */
async function verifyTransaction(reference) {
  const response = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: headers() }
  )
  return response.data.data
}

/**
 * Verify Paystack webhook signature.
 * Must be called before processing any webhook payload.
 */
function verifyWebhookSignature(rawBody, signatureHeader) {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex')
  return hash === signatureHeader
}

/**
 * Express webhook handler for Paystack events.
 * Wire this up in index.js: app.post('/webhook/paystack', paystackWebhookHandler)
 */
async function webhookHandler(req, res, onChargeSuccess) {
  const signature = req.headers['x-paystack-signature']

  if (!verifyWebhookSignature(req.rawBody, signature)) {
    return res.status(400).json({ message: 'Invalid signature' })
  }

  res.sendStatus(200) // acknowledge immediately — Paystack retries if not 200

  const event = req.body
  if (event.event === 'charge.success') {
    await onChargeSuccess(event.data)
  }
}

module.exports = { initializeTransaction, verifyTransaction, verifyWebhookSignature, webhookHandler }

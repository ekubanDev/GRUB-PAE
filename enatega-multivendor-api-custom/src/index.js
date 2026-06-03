require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const http = require('http')
const { ApolloServer } = require('apollo-server-express')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const mongoose = require('mongoose')
const Sentry = require('@sentry/node')

const typeDefs = require('./schema/typeDefs')
const { resolvers, pubsub, EVENTS } = require('./schema/resolvers/index')
const { getContextUser } = require('./middleware/auth')
const { webhookHandler } = require('./services/paystack')
const Order = require('./models/Order')
const { notifyCustomerOrderStatus } = require('./services/notifications')

const PORT = process.env.PORT || 4000

// ─── Sentry ──────────────────────────────────────────────────────────────────

if (process.env.SENTRY_DSN && process.env.SENTRY_DSN.startsWith('https://')) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV })
}

// ─── MongoDB ─────────────────────────────────────────────────────────────────

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected')

  // Seed Configuration with GRUB-PAE defaults on first boot
  const Configuration = require('./models/Configuration')
  const existing = await Configuration.findOne()
  if (!existing) {
    await Configuration.create({
      currency: 'GHS',
      currencySymbol: '₵',
      deliveryRate: 5,
      costType: 'fixed',
      // Firebase Web SDK config for GRUB-PAE project
      firebaseKey: 'AIzaSyAEWbll-mv0hD9jBZR51wqfVpxxYIilVz8',
      authDomain: 'grub-pae.firebaseapp.com',
      projectId: 'grub-pae',
      storageBucket: 'grub-pae.firebasestorage.app',
      msgSenderId: '367067097306',
      appId: '1:367067097306:web:cdb4efc41c792b85499de3',
      measurementId: 'G-K8WV720K8C',
      googleApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      cloudinaryUploadUrl: process.env.CLOUDINARY_UPLOAD_URL || '',
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
      skipEmailVerification: process.env.NODE_ENV !== 'production',
      skipMobileVerification: process.env.NODE_ENV !== 'production',
      testOtp: '123456'
    })
    console.log('Configuration seeded with GRUB-PAE defaults')
  }
}

// ─── Express setup ───────────────────────────────────────────────────────────

async function startServer() {
  await connectDB()

  const app = express()

  app.use(cors({ origin: '*', credentials: true }))
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' }))

  // Parse JSON and capture raw body for Paystack webhook signature verification
  app.use(express.json({
    verify: (req, _res, buf) => { req.rawBody = buf.toString() }
  }))

  // Health check for Docker / load balancer
  app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }))

  // Paystack webhook
  app.post('/webhook/paystack', (req, res) => {
    webhookHandler(req, res, async (data) => {
      const ref = data.reference
      const order = await Order.findOne({ paystackReference: ref })
      if (!order) return
      order.paymentStatus = 'PAID'
      order.paidAmount = data.amount / 100
      await order.save()
      pubsub.publish(`${EVENTS.ORDER_STATUS_CHANGED}_USER_${order.user}`, {
        orderStatusChanged: { userId: String(order.user), origin: 'payment', order }
      })
    })
  })

  // ─── Apollo Server ─────────────────────────────────────────────────────────

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const user = await getContextUser(req)
      return { user, req, pubsub, EVENTS }
    },
    formatError: (err) => {
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(err)
        return { message: err.message }
      }
      return err
    },
    introspection: true
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql', cors: false })

  const httpServer = http.createServer(app)

  // ─── WebSocket subscriptions ──────────────────────────────────────────────

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async (connectionParams) => {
        const token = connectionParams?.authorization?.replace('Bearer ', '')
        if (!token) return {}
        const { getContextUser } = require('./middleware/auth')
        const user = await getContextUser({ headers: { authorization: `Bearer ${token}` } })
        return { user }
      }
    },
    { server: httpServer, path: '/graphql' }
  )

  httpServer.listen(PORT, () => {
    console.log(`GRUB-PAE API running on http://localhost:${PORT}/graphql`)
    console.log(`WebSocket subscriptions on ws://localhost:${PORT}/graphql`)
  })
}

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

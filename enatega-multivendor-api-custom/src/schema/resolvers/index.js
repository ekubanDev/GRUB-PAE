const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const EVENTS = {
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  RIDER_LOCATION_UPDATED: 'RIDER_LOCATION_UPDATED',
  NEW_ORDER: 'NEW_ORDER',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE'
}

const resolvers = {
  Query: require('./query'),
  Mutation: require('./mutation'),
  Subscription: require('./subscription')(pubsub, EVENTS)
}

module.exports = { resolvers, pubsub, EVENTS }

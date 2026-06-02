module.exports = (pubsub, EVENTS) => ({
  subscriptionOrder: {
    subscribe: (_, { id }) => pubsub.asyncIterator([`${EVENTS.ORDER_STATUS_CHANGED}_${id}`])
  },

  subscriptionRiderLocation: {
    subscribe: (_, { riderId }) => pubsub.asyncIterator([`${EVENTS.RIDER_LOCATION_UPDATED}_${riderId}`])
  },

  orderStatusChanged: {
    subscribe: (_, { userId }) => pubsub.asyncIterator([`${EVENTS.ORDER_STATUS_CHANGED}_USER_${userId}`])
  },

  subscriptionNewMessage: {
    subscribe: (_, { order }) => pubsub.asyncIterator([`${EVENTS.NEW_CHAT_MESSAGE}_${order}`])
  },

  subscribeToNewOrders: {
    subscribe: (_, { restaurantId }) => pubsub.asyncIterator([`${EVENTS.NEW_ORDER}_${restaurantId}`])
  },

  riderLocation: {
    subscribe: (_, { riderId }) => pubsub.asyncIterator([`${EVENTS.RIDER_LOCATION_UPDATED}_${riderId}`])
  }
})

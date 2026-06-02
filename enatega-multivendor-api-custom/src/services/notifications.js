const { sendPushNotification, sendMulticastNotification } = require('./firebase')

async function notifyRiderAssigned({ riderToken, order }) {
  return sendPushNotification({
    token: riderToken,
    title: 'New Delivery',
    body: `New order #${order.orderId} — pick up from ${order.restaurant?.name}`,
    data: { orderId: String(order._id), type: 'ORDER_ASSIGNED' }
  })
}

async function notifyRestaurantNewOrder({ restaurantToken, order }) {
  return sendPushNotification({
    token: restaurantToken,
    title: 'New Order!',
    body: `Order #${order.orderId} received`,
    data: { orderId: String(order._id), type: 'NEW_ORDER' }
  })
}

async function notifyCustomerOrderStatus({ customerToken, order, status }) {
  const messages = {
    ACCEPTED: 'Your order has been accepted by the restaurant',
    ASSIGNED: 'A rider has been assigned to your order',
    PICKED: 'Your order is on the way!',
    DELIVERED: 'Your order has been delivered. Enjoy!',
    CANCELLED: 'Your order has been cancelled'
  }
  return sendPushNotification({
    token: customerToken,
    title: 'Order Update',
    body: messages[status] || `Order status: ${status}`,
    data: { orderId: String(order._id), type: 'ORDER_STATUS', status }
  })
}

module.exports = { notifyRiderAssigned, notifyRestaurantNewOrder, notifyCustomerOrderStatus }

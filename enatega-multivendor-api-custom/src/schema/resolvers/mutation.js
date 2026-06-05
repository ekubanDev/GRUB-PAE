const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const Rider = require('../../models/Rider')
const Restaurant = require('../../models/Restaurant')
const Order = require('../../models/Order')
const Review = require('../../models/Review')
const Coupon = require('../../models/Coupon')
const Configuration = require('../../models/Configuration')
const ChatMessage = require('../../models/ChatMessage')
const { requireAuth, requireAdmin } = require('../../middleware/auth')
const { initializeTransaction, verifyTransaction } = require('../../services/paystack')
const { sendPushNotification } = require('../../services/firebase')
const { notifyRestaurantNewOrder, notifyCustomerOrderStatus } = require('../../services/notifications')
const { sendPasswordReset } = require('../../services/email')

// Bcrypt not installed yet — TODO: add to dependencies
// const bcrypt = require('bcryptjs')

function issueToken(userId, userType) {
  return jwt.sign({ userId, userType }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
  // ─── Auth ──────────────────────────────────────────────────────────────────

  login: async (_, { email, password, type, appleId, name, notificationToken }) => {
    let user

    if (type === 'default' && email && password) {
      user = await User.findOne({ email: email.toLowerCase() })
      if (!user) throw new Error('No account found with this email')
      if (!user.password) throw new Error('Please use social login or reset your password')
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) throw new Error('Incorrect password')
    } else if (type === 'apple' && appleId) {
      user = await User.findOneAndUpdate(
        { appleId },
        { $setOnInsert: { name, appleId, isActive: true } },
        { upsert: true, new: true }
      )
    } else {
      throw new Error('Invalid login type')
    }

    if (!user.isActive) throw new Error('Account is deactivated')
    if (notificationToken) await User.findByIdAndUpdate(user._id, { notificationToken })

    const token = issueToken(String(user._id), 'user')
    return { userId: String(user._id), token, tokenExpiration: 30, name: user.name, email: user.email, phone: user.phone, isActive: user.isActive }
  },

  createUser: async (_, { userInput }) => {
    const { phone, email, password, name, notificationToken, appleId, emailIsVerified, isPhoneExists } = userInput
    const existing = await User.findOne({ $or: [email ? { email: email.toLowerCase() } : null, phone ? { phone } : null].filter(Boolean) })
    if (existing) throw new Error('Account already exists')

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined
    const user = await User.create({ phone, email: email?.toLowerCase(), password: hashedPassword, name, notificationToken, appleId, emailIsVerified, phoneIsVerified: isPhoneExists })
    const token = issueToken(String(user._id), 'user')
    return { userId: String(user._id), token, tokenExpiration: 30, name: user.name, email: user.email, phone: user.phone }
  },

  ownerLogin: async (_, { email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase(), userType: { $in: ['admin', 'vendor'] } })
    if (!user) throw new Error('No admin account found')
    if (!user.password) throw new Error('Password not set for this account')
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Incorrect password')
    const token = issueToken(String(user._id), user.userType)
    const restaurants = await Restaurant.find({ owner: user._id }).select('_id orderId name image address')
    // Admin frontend expects UPPERCASE userType (ADMIN, VENDOR, RESTAURANT)
    const userTypeUpper = user.userType.toUpperCase()
    return { userId: String(user._id), token, tokenExpiration: 30, email: user.email, userType: userTypeUpper, restaurants, name: user.name, image: user.image }
  },

  // ─── User ──────────────────────────────────────────────────────────────────

  updateUser: async (_, { updateUserInput }, { user }) => {
    requireAuth(user)
    return User.findByIdAndUpdate(user.userId, updateUserInput, { new: true })
  },

  updateNotificationStatus: async (_, { offerNotification, orderNotification }, { user }) => {
    requireAuth(user)
    return User.findByIdAndUpdate(user.userId, { isOfferNotification: offerNotification, isOrderNotification: orderNotification }, { new: true })
  },

  pushToken: async (_, { token }, { user }) => {
    requireAuth(user)
    return User.findByIdAndUpdate(user.userId, { notificationToken: token }, { new: true })
  },

  changePassword: async (_, { oldPassword, newPassword }, { user }) => {
    requireAuth(user)
    const u = await User.findById(user.userId)
    if (!u?.password) throw new Error('No password set')
    const valid = await bcrypt.compare(oldPassword, u.password)
    if (!valid) throw new Error('Incorrect current password')
    const hashed = await bcrypt.hash(newPassword, 12)
    await User.findByIdAndUpdate(user.userId, { password: hashed })
    return true
  },

  forgotPassword: async (_, { email }) => {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return { result: false }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    await sendPasswordReset({ to: email, resetLink: `https://grubpae.com/reset-password?token=${token}` })
    return { result: true }
  },

  resetPassword: async (_, { password, email }) => {
    const hashed = await bcrypt.hash(password, 12)
    await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashed })
    return { result: true }
  },

  emailExist: async (_, { email }) => {
    const user = await User.findOne({ email: email.toLowerCase() })
    return user ? { userType: user.userType, _id: user._id, email: user.email } : null
  },

  phoneExist: async (_, { phone }) => {
    const user = await User.findOne({ phone })
    return user ? { userType: user.userType, _id: user._id, phone: user.phone } : null
  },

  sendOtpToEmail: async (_, { email }) => {
    // TODO: generate OTP, store on user, send via SendGrid/Twilio
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await User.findOneAndUpdate({ email: email.toLowerCase() }, { otp, otpExpiry: new Date(Date.now() + 10 * 60000) })
    return { result: true }
  },

  sendOtpToPhoneNumber: async (_, { phone }) => {
    // TODO: send OTP via Twilio to +233 (Ghana) numbers
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await User.findOneAndUpdate({ phone }, { otp, otpExpiry: new Date(Date.now() + 10 * 60000) })
    return { result: true }
  },

  verifyOtp: async (_, { otp, email, phone }) => {
    const query = email ? { email: email.toLowerCase() } : { phone }
    const user = await User.findOne(query)
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) return { result: false }
    await User.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null })
    return { result: true }
  },

  Deactivate: async (_, { isActive, email }) => {
    return User.findOneAndUpdate({ email: email.toLowerCase() }, { isActive }, { new: true })
  },

  // ─── Address ───────────────────────────────────────────────────────────────

  createAddress: async (_, { addressInput }, { user }) => {
    requireAuth(user)
    const { latitude, longitude, ...rest } = addressInput
    const address = { ...rest, location: { type: 'Point', coordinates: [longitude, latitude] } }
    return User.findByIdAndUpdate(user.userId, { $push: { addresses: address } }, { new: true })
  },

  editAddress: async (_, { addressInput }, { user }) => {
    requireAuth(user)
    const { _id, latitude, longitude, ...rest } = addressInput
    return User.findOneAndUpdate(
      { _id: user.userId, 'addresses._id': _id },
      { $set: { 'addresses.$': { ...rest, _id, location: { type: 'Point', coordinates: [longitude, latitude] } } } },
      { new: true }
    )
  },

  deleteAddress: async (_, { id }, { user }) => {
    requireAuth(user)
    return User.findByIdAndUpdate(user.userId, { $pull: { addresses: { _id: id } } }, { new: true })
  },

  deleteBulkAddresses: async (_, { ids }, { user }) => {
    requireAuth(user)
    return User.findByIdAndUpdate(user.userId, { $pull: { addresses: { _id: { $in: ids } } } }, { new: true })
  },

  selectAddress: async (_, { id }, { user }) => {
    requireAuth(user)
    await User.updateOne({ _id: user.userId }, { $set: { 'addresses.$[].selected': false } })
    return User.findOneAndUpdate(
      { _id: user.userId, 'addresses._id': id },
      { $set: { 'addresses.$.selected': true } },
      { new: true }
    )
  },

  addFavourite: async (_, { id }, { user }) => {
    requireAuth(user)
    const u = await User.findById(user.userId)
    const isFav = u.favourite?.includes(id)
    return User.findByIdAndUpdate(
      user.userId,
      isFav ? { $pull: { favourite: id } } : { $addToSet: { favourite: id } },
      { new: true }
    )
  },

  // ─── Orders ────────────────────────────────────────────────────────────────

  placeOrder: async (_, args, { user }) => {
    requireAuth(user)
    const { restaurant, orderInput, paymentMethod, couponCode, tipping, taxationAmount, address, orderDate, isPickedUp, deliveryCharges, instructions } = args

    const rest = await Restaurant.findById(restaurant)
    if (!rest) throw new Error('Restaurant not found')

    let discountAmount = 0
    if (couponCode) {
      const coupon = await Coupon.findOne({ title: couponCode, restaurant, enabled: true })
      if (coupon) discountAmount = coupon.discount
    }

    const orderAmount = orderInput.reduce((total, item) => {
      // TODO: look up actual food price from restaurant categories
      return total + (item.quantity * 0)
    }, 0)

    const { latitude, longitude, ...addressRest } = address
    const deliveryAddress = { ...addressRest, location: { type: 'Point', coordinates: [longitude || 0, latitude || 0] } }

    const order = await Order.create({
      restaurant,
      user: user.userId,
      items: orderInput,
      paymentMethod,
      orderAmount: orderAmount + tipping + taxationAmount + deliveryCharges - discountAmount,
      tipping,
      taxationAmount,
      deliveryCharges,
      discountAmount,
      deliveryAddress,
      orderDate,
      isPickedUp,
      instructions,
      orderStatus: 'PENDING',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING'
    })

    // Notify restaurant
    if (rest.notificationToken) {
      await notifyRestaurantNewOrder({ restaurantToken: rest.notificationToken, order })
    }

    return Order.findById(order._id).populate('restaurant rider review user')
  },

  abortOrder: async (_, { id }, { user }) => {
    requireAuth(user)
    return Order.findOneAndUpdate(
      { _id: id, user: user.userId, orderStatus: 'PENDING' },
      { orderStatus: 'CANCELLED', cancelledAt: new Date() },
      { new: true }
    )
  },

  reviewOrder: async (_, { reviewInput }, { user }) => {
    requireAuth(user)
    const { order: orderId, rating, description } = reviewInput
    const order = await Order.findById(orderId)
    if (!order || String(order.user) !== user.userId) throw new Error('Order not found')
    const review = await Review.create({ order: orderId, restaurant: order.restaurant, user: user.userId, rating, description })
    return Order.findByIdAndUpdate(orderId, { review: review._id }, { new: true }).populate('restaurant rider review user')
  },

  // ─── Coupon ────────────────────────────────────────────────────────────────

  coupon: async (_, { coupon: code, restaurantId }) => {
    const coupon = await Coupon.findOne({ title: code, enabled: true, $or: [{ restaurant: restaurantId }, { restaurant: null }] })
    if (!coupon) return { coupon: null, message: 'Invalid or expired coupon', success: false }
    return { coupon, message: 'Coupon applied', success: true }
  },

  // ─── Chat ──────────────────────────────────────────────────────────────────

  sendChatMessage: async (_, { message, orderId }, { user }) => {
    requireAuth(user)
    const u = await User.findById(user.userId)
    const msg = await ChatMessage.create({
      order: orderId,
      message: message.message,
      user: { id: user.userId, name: u.name }
    })
    return { success: true, message: 'Message sent', data: msg }
  },

  // ─── Activity ──────────────────────────────────────────────────────────────

  createActivity: async (_, args) => true,

  // ─── Metrics / bop-auth ────────────────────────────────────────────────────
  // This implements the bop-auth security handshake used by all frontends.
  // Frontends call this with a nonce header to obtain a short-lived token.
  metricsGeneral: async (_, __, { req }) => {
    const nonce = req?.headers?.nonce || ''
    const jwt_token = require('jsonwebtoken').sign({ nonce }, process.env.JWT_SECRET, { expiresIn: '5m' })
    return { experience: jwt_token, hehe: 'ok' }
  },

  // ─── Notifications ─────────────────────────────────────────────────────────

  sendNotificationUser: async (_, { notificationInput }, { user }) => {
    requireAuth(user)
    const Notification = require('../../models/Notification')
    return Notification.create(notificationInput)
  },

  markNotificationRead: async (_, { id }, { user }) => {
    requireAuth(user)
    const Notification = require('../../models/Notification')
    return Notification.findByIdAndUpdate(id, { read: true }, { new: true })
  },

  // ─── Configuration (admin) ─────────────────────────────────────────────────

  saveEmailConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveFormEmailConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveSendGridConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveFirebaseConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveSentryConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveGoogleApiKeyConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveCloudinaryConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveAmplitudeApiKeyConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveGoogleClientIDConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveWebConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveAppConfigurations: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveDeliveryRateConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  savePaypalConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveStripeConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveTwilioConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveVerificationsToggle: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },
  saveCurrencyConfiguration: async (_, { configurationInput }, { user }) => {
    requireAdmin(user)
    return Configuration.findOneAndUpdate({}, configurationInput, { upsert: true, new: true })
  },

  // ─── Restaurant admin ──────────────────────────────────────────────────────

  createRestaurant: async (_, { restaurant, owner }, { user }) => {
    requireAdmin(user)
    const count = await Restaurant.countDocuments()
    return Restaurant.create({ ...restaurant, owner, orderId: count + 1, location: { type: 'Point', coordinates: [restaurant.location?.longitude || 0, restaurant.location?.latitude || 0] } })
  },

  deleteRestaurant: async (_, { id }, { user }) => {
    requireAdmin(user)
    return Restaurant.findByIdAndUpdate(id, { isActive: false }, { new: true })
  },

  hardDeleteRestaurant: async (_, { id }, { user }) => {
    requireAdmin(user)
    await Restaurant.findByIdAndDelete(id)
    return true
  },

  updateDeliveryBoundsAndLocation: async (_, { id, boundType, bounds, location, address, postCode, city }, { user }) => {
    requireAdmin(user)
    const update = {
      'location.coordinates': [location.longitude, location.latitude],
      address,
      postCode,
      city
    }
    if (bounds) update.deliveryBounds = { type: 'Polygon', coordinates: bounds }
    const data = await Restaurant.findByIdAndUpdate(id, update, { new: true })
    return { success: true, message: 'Updated', data }
  }
}

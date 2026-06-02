const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  deliveryAddress: String,
  details: String,
  label: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  selected: { type: Boolean, default: false }
})

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, lowercase: true },
    phone: String,
    phoneIsVerified: { type: Boolean, default: false },
    emailIsVerified: { type: Boolean, default: false },
    password: String,
    isActive: { type: Boolean, default: true },
    isOrderNotification: { type: Boolean, default: true },
    isOfferNotification: { type: Boolean, default: true },
    notificationToken: String,
    addresses: [addressSchema],
    favourite: [String],
    userType: { type: String, default: 'default' },
    appleId: String,
    otp: String,
    otpExpiry: Date
  },
  { timestamps: true }
)

userSchema.index({ email: 1 })
userSchema.index({ phone: 1 })

module.exports = mongoose.model('User', userSchema)

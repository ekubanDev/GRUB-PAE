const mongoose = require('mongoose')

const riderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true },
    username: String,
    password: String,
    phone: String,
    image: String,
    available: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    notificationToken: String,
    currentWalletAmount: { type: Number, default: 0 },
    totalWalletAmount: { type: Number, default: 0 },
    withdrawnWalletAmount: { type: Number, default: 0 },
    accountNumber: String
  },
  { timestamps: true }
)

riderSchema.index({ location: '2dsphere' })
riderSchema.index({ email: 1 })

module.exports = mongoose.model('Rider', riderSchema)

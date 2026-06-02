const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    enabled: { type: Boolean, default: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Coupon', couponSchema)

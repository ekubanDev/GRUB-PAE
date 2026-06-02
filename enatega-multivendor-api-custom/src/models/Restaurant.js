const mongoose = require('mongoose')

const openingTimeSchema = new mongoose.Schema({
  day: String,
  times: [
    {
      startTime: [String],
      endTime: [String]
    }
  ]
})

const restaurantSchema = new mongoose.Schema(
  {
    orderId: { type: Number, default: 1 },
    orderPrefix: String,
    name: { type: String, required: true },
    image: String,
    logo: String,
    address: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    deliveryBounds: {
      type: { type: String, default: 'Polygon' },
      coordinates: [[[Number]]]
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    password: String,
    deliveryTime: { type: Number, default: 30 },
    minimumOrder: { type: Number, default: 0 },
    sections: [String],
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    openingTimes: [openingTimeSchema],
    slug: String,
    stripeDetailsSubmitted: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    notificationToken: String,
    enableNotification: { type: Boolean, default: true },
    shopType: String,
    cuisines: [String],
    phone: String,
    restaurantUrl: String,
    keywords: [String],
    tags: [String],
    postCode: String,
    city: String
  },
  { timestamps: true }
)

restaurantSchema.index({ location: '2dsphere' })
restaurantSchema.index({ slug: 1 })
restaurantSchema.index({ isActive: 1, isAvailable: 1 })

module.exports = mongoose.model('Restaurant', restaurantSchema)

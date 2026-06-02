const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  title: String,
  food: String,
  description: String,
  image: String,
  quantity: { type: Number, default: 1 },
  variation: {
    _id: String,
    title: String,
    price: Number,
    discounted: Number
  },
  addons: [
    {
      _id: String,
      title: String,
      description: String,
      quantityMinimum: Number,
      quantityMaximum: Number,
      options: [
        {
          _id: String,
          title: String,
          description: String,
          price: Number
        }
      ]
    }
  ],
  specialInstructions: String,
  isActive: { type: Boolean, default: true }
})

const deliveryAddressSchema = new mongoose.Schema({
  id: String,
  deliveryAddress: String,
  details: String,
  label: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  }
})

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    deliveryAddress: deliveryAddressSchema,
    items: [orderItemSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    paymentMethod: { type: String, required: true },
    // Paystack-specific payment fields
    paystackReference: String,
    paystackStatus: String,
    paidAmount: { type: Number, default: 0 },
    orderAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING'
    },
    reason: String,
    isActive: { type: Boolean, default: true },
    tipping: { type: Number, default: 0 },
    taxationAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    completionTime: String,
    orderDate: String,
    expectedTime: String,
    preparationTime: String,
    isPickedUp: { type: Boolean, default: false },
    acceptedAt: Date,
    pickedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    assignedAt: Date,
    isRinged: { type: Boolean, default: false },
    isRiderRinged: { type: Boolean, default: false },
    instructions: String
  },
  { timestamps: true }
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ restaurant: 1, createdAt: -1 })
orderSchema.index({ rider: 1 })
orderSchema.index({ orderStatus: 1 })

module.exports = mongoose.model('Order', orderSchema)

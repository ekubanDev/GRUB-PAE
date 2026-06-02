const mongoose = require('mongoose')

const variationSchema = new mongoose.Schema({
  title: String,
  price: { type: Number, required: true },
  discounted: { type: Number, default: 0 },
  addons: [String],
  isOutOfStock: { type: Boolean, default: false }
})

const foodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    subCategory: String,
    variations: [variationSchema],
    isActive: { type: Boolean, default: true },
    isOutOfStock: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    foods: [foodSchema]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)

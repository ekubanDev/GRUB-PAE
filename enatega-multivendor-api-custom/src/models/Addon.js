const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }
})

const addonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    options: [String],
    quantityMinimum: { type: Number, default: 0 },
    quantityMaximum: { type: Number, default: 1 },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
  },
  { timestamps: true }
)

const Option = mongoose.model('Option', optionSchema)
const Addon = mongoose.model('Addon', addonSchema)

module.exports = { Addon, Option }

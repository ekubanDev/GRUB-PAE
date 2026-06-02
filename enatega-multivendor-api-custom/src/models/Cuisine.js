const mongoose = require('mongoose')

const cuisineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String,
    shopType: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cuisine', cuisineSchema)

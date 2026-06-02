const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    action: String,
    screen: String,
    file: String,
    parameters: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Banner', bannerSchema)

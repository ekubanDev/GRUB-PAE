const mongoose = require('mongoose')

const zoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: {
      type: { type: String, default: 'Polygon' },
      coordinates: [[[Number]]]
    },
    isActive: { type: Boolean, default: true },
    tax: { type: Number, default: 0 }
  },
  { timestamps: true }
)

zoneSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Zone', zoneSchema)

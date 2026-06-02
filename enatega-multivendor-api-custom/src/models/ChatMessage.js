const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    message: { type: String, required: true },
    user: {
      id: String,
      name: String
    }
  },
  { timestamps: true }
)

chatMessageSchema.index({ order: 1, createdAt: 1 })

module.exports = mongoose.model('ChatMessage', chatMessageSchema)

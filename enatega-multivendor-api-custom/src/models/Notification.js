const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: String,
    data: String,
    read: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

notificationSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)

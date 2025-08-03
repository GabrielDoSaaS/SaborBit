const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef',
    required: true,
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    itemName: String,
    unitPrice: Number,
    quantity: Number,
    observations: String,
  }],
  total: {
    type: Number,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: String,
    required: true,
  },
  clientAddress: String,
  observations: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'delivered'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  description: { type: String, default: '' },
  expiryDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
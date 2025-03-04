const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  details: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: false },
  coverPhoto: { type: String, required: false },
});

module.exports = mongoose.model('product', ProductSchema);

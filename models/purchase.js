// models/purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  receipt: {
    type: String, // URL of the uploaded receipt file
    required: false,
  },
  serviceName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',  // default status is pending
  },
  serviceId: {  // Add the serviceId reference here
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Reference to the Service model
    required: true,  // Ensure this is always provided
  },
  apiKey: {
    type: String, // New field to store the fetched API key
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;

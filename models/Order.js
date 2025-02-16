const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  service: {
    name: String,
    description: String,
    price: Number,
  },
  paymentMethod: String,
  receipt: String, // URL to uploaded receipt
  status: { type: String, default: "pending" }, // pending, confirmed, completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

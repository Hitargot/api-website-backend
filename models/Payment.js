const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Bitcoin, USDT
  address: { type: String, required: true }, // Crypto wallet address
  qrCode: String, // Optional: Store QR code image URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);

const mongoose = require("mongoose");

const ServiceAPISchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, unique: true },
  apiKey: { type: String, required: true }
});

module.exports = mongoose.model("ServiceAPI", ServiceAPISchema);

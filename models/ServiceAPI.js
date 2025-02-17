const mongoose = require("mongoose");

const serviceAPISchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,  // Ensures service is an ObjectId reference
    ref: "Service",  // Reference to the Service model
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
});

const ServiceAPI = mongoose.model("ServiceAPI", serviceAPISchema);

module.exports = ServiceAPI;

const mongoose = require("mongoose");

const serviceAPISchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    unique: true, // Ensure service names are unique
  },
  apiKey: {
    type: String,
    required: true,
  },
});

const ServiceAPI = mongoose.model("ServiceAPI", serviceAPISchema);

module.exports = ServiceAPI;

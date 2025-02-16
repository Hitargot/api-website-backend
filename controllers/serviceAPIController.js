const ServiceAPI = require("../models/ServiceAPI");

// Fetch API for a Service
exports.fetchAPI = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const serviceAPI = await ServiceAPI.findOne({ service: serviceId });

    if (!serviceAPI) {
      return res.status(404).json({ error: "No API found for this service." });
    }

    res.status(200).json({ apiKey: serviceAPI.apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching API.", details: error.message });
  }
};

// Add or Update API for a Service
exports.addOrUpdateAPI = async (req, res) => {
  const { serviceId, apiKey } = req.body;

  try {
    let serviceAPI = await ServiceAPI.findOne({ service: serviceId });

    if (serviceAPI) {
      // Update existing API
      serviceAPI.apiKey = apiKey;
      await serviceAPI.save();
      return res.status(200).json({ message: "API updated successfully." });
    } else {
      // Create new API entry
      serviceAPI = new ServiceAPI({ service: serviceId, apiKey });
      await serviceAPI.save();
      return res.status(201).json({ message: "API added successfully." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding or updating API.", details: error.message });
  }
};

// Delete API for a Service
exports.deleteAPI = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const deletedAPI = await ServiceAPI.findOneAndDelete({ service: serviceId });
    if (!deletedAPI) {
      return res.status(404).json({ error: "API not found for this service." });
    }

    res.status(200).json({ message: "API deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting API.", details: error.message });
  }
};

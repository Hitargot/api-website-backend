const ServiceAPI = require("../models/ServiceAPI");
const Service = require("../models/Service"); // Assuming you have a Service model

// Fetch all services for dropdown selection
exports.fetchAllServices = async (req, res) => {
  try {
    const services = await Service.find({}, "name _id"); // Fetch only service name and ID
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching services.", details: error.message });
  }
};

// Fetch all stored API keys with services
exports.fetchAPIList = async (req, res) => {
    try {
      const apiList = await ServiceAPI.find().populate("service", "name"); // This will now correctly populate the `service` name
      res.status(200).json(apiList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching API list.", details: error.message });
    }
  };
  

// Add or Update API for a Service
exports.addOrUpdateAPI = async (req, res) => {
    const { serviceId, apiKey } = req.body;
  
    try {
      let serviceAPI = await ServiceAPI.findOne({ service: serviceId });
  
      if (serviceAPI) {
        serviceAPI.apiKey = apiKey;
        await serviceAPI.save();
        return res.status(200).json({ message: "API updated successfully." });
      } else {
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

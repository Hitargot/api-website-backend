const Service = require("../models/Service");

// ✅ Create a New Service
// controllers/serviceController.js

exports.createService = async (req, res) => {
    try {
      const { name, description, price, packages } = req.body;
  
      if (!name || !description || (!price && (!packages || packages.length === 0))) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const newService = new Service({
        name,
        description,
        price,
        packages,
      });
  
      await newService.save();
  
      res.status(201).json({ message: "Service created successfully", service: newService });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
// ✅ Fetch All Services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Update a Service
exports.updateService = async (req, res) => {
    try {
      const { name, description, price, packages } = req.body;
  
      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        { name, description, price, packages },
        { new: true }
      );
  
      if (!updatedService) return res.status(404).json({ message: "Service not found" });
  
      res.status(200).json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  exports.addPackageToService = async (req, res) => {
    try {
      const { id } = req.params;
      const newPackage = req.body;
  
      const service = await Service.findById(id);
      if (!service) return res.status(404).json({ message: "Service not found" });
  
      service.packages.push(newPackage);
      await service.save();
  
      res.status(200).json({ message: "Package added", service });
    } catch (error) {
      res.status(500).json({ message: "Error adding package", error: error.message });
    }
  };
  

// ✅ Delete a Service
exports.deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);

        if (!deletedService) return res.status(404).json({ message: "Service not found" });

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Add a Review
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const service = await Service.findById(req.params.id);

        if (!service) return res.status(404).json({ message: "Service not found" });

        // Add new review
        const newReview = { user: req.user.id, rating, comment };
        service.reviews.push(newReview);

        // Calculate new average rating
        service.totalReviews = service.reviews.length;
        service.averageRating =
            service.reviews.reduce((sum, rev) => sum + rev.rating, 0) / service.totalReviews;

        await service.save();
        res.status(201).json({ message: "Review added successfully", service });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

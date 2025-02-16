const express = require("express");
const { createService, getAllServices, updateService, deleteService, addReview } = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createService);   // Create service (Admin only)
router.get("/servies", getAllServices);                   // Get all services
router.put("/:id", authMiddleware, updateService); // Update service (Admin only)
router.delete("/:id", authMiddleware, deleteService); // Delete service (Admin only)
router.post("/:id/review", authMiddleware, addReview); // Add review (Authenticated users)

module.exports = router;

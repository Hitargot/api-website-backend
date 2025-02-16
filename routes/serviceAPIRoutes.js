const express = require("express");
const router = express.Router();
const serviceAPIController = require("../controllers/serviceAPIController");

// Route to fetch API key for a specific service
router.get("/fetch/:serviceId", serviceAPIController.fetchAPI);

// Route to add or update API key for a service
router.post("/add-or-update", serviceAPIController.addOrUpdateAPI);

// Route to delete API key for a service
router.delete("/delete/:serviceId", serviceAPIController.deleteAPI);

module.exports = router;

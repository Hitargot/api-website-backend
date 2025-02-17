const express = require("express");
const router = express.Router();
const serviceAPIController = require("../controllers/serviceAPIController");

router.post("/add-or-update", serviceAPIController.addOrUpdateAPI);
router.delete("/delete/:serviceId", serviceAPIController.deleteAPI);
router.get("/fetch-all-services", serviceAPIController.fetchAllServices); // Fetch services for dropdown
router.get("/fetch-api-list", serviceAPIController.fetchAPIList); // Fetch list of stored APIs

module.exports = router;

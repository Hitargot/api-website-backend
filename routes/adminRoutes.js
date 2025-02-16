// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Fetch all purchases for admin
router.get('/purchases', adminController.getAllPurchases);

// Update purchase status (accept or reject)
router.post('/purchase/status', adminController.updatePurchaseStatus);

module.exports = router;

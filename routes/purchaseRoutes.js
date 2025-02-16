// routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Define POST route to create a new purchase
router.post('/purchase', purchaseController.createPurchase);

module.exports = router;

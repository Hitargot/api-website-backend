const express = require("express");
const { adminSignup, adminLogin, forgotPassword, resetPassword } = require("../controllers/adminAuthController");
const router = express.Router();

router.post("/signup", adminSignup);  // Admin Signup
router.post("/login", adminLogin);    // Admin Login
router.post("/forgot-password", forgotPassword); // Forgot Password
router.post("/reset-password", resetPassword);

module.exports = router;

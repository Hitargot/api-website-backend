require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const purchaseRoutes = require('./routes/purchaseRoutes');  // Import the purchase routes
const adminRoutes = require('./routes/adminRoutes')
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));


// ✅ More Flexible CORS
const cors = require('cors');

app.use(cors({
  origin: 'https://snazzy-lebkuchen-e377a7.netlify.app', // Allow Netlify domain
  credentials: true, // Allow cookies (if needed)
  methods: 'GET, POST, PUT, DELETE', // Allowed methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers
}));



// ✅ Handle Preflight Requests
app.options("*", cors());

connectDB();

// Serve QR Code images
app.use("/uploads", express.static("uploads"));
app.use('/api', purchaseRoutes);
// Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/services", serviceRoutes); // Mount service routes
app.use("/api/admin", adminRoutes); // Mount service routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

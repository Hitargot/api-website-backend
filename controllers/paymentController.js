const Payment = require("../models/Payment");
const upload = require("../middleware/upload");

// 📌 **1️⃣ Admin: Create a New Payment Method**
exports.createPayment = async (req, res) => {
    try {
      // If file upload failed, return error
      if (!req.file) {
        return res.status(400).json({ error: "QR code is required" });
      }
  
      const { name, address } = req.body;
      const qrCodeUrl = `https://api-selling-website.netlify.app/uploads/${req.file.filename}`;  // Path to the uploaded QR code
  
      // Check if all required fields are present
      if (!name || !address) {
        return res.status(400).json({ error: "Name and address are required" });
      }
  
      // Create the new payment method
      const newPayment = new Payment({
        name,
        address,
        qrCode: qrCodeUrl,
      });
  
      // Save the new payment method to the database
      await newPayment.save();
  
      // Return success message along with the created payment method
      res.status(201).json({ 
        message: "Payment method added successfully!", 
        payment: newPayment 
      });
    } catch (error) {
      console.error("Error creating payment method:", error);
      res.status(500).json({ error: "Error creating payment method", details: error.message });
    }
  };
  
// 📌 **2️⃣ Fetch All Payment Methods**
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payment methods" });
  }
};

// 📌 **3️⃣ Admin: Delete a Payment Method**
exports.deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment method deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting payment method" });
  }
};

// 📌 **4️⃣ Admin: Edit Payment Method**
exports.editPayment = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address } = req.body;
  
      // Validate that required fields are provided
      if (!name || !address) {
        return res.status(400).json({ error: "Name and address are required" });
      }
  
      // Find the existing payment method
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment method not found" });
      }
  
      // If a new QR code is uploaded, handle the file update
      let qrCodeUrl = payment.qrCode; // Default to the existing QR code URL if no new file is uploaded
      if (req.file) {
        qrCodeUrl = `https://api-selling-website.netlify.app/uploads/${req.file.filename}`; // Update the QR code URL with the new file
      }
  
      // Update the payment method fields
      payment.name = name;
      payment.address = address;
      payment.qrCode = qrCodeUrl;
  
      // Save the updated payment method
      await payment.save();
  
      // Return the updated payment method
      res.json({ 
        message: "Payment method updated successfully!", 
        payment 
      });
    } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "Error updating payment method", details: error.message });
    }
  };
  

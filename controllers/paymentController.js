const Payment = require("../models/Payment");
const upload = require("../middleware/upload");

// 📌 **1️⃣ Admin: Create a New Payment Method**
exports.createPayment = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "QR code is required" });
      }

      const { name, address } = req.body;
      if (!name || !address) {
          return res.status(400).json({ error: "Name and address are required" });
      }

      // Dynamically get the correct QR code URL
      const qrCodeUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      console.log("QR Code URL:", qrCodeUrl); // Debugging line

      const newPayment = new Payment({ name, address, qrCode: qrCodeUrl });
      await newPayment.save();

      res.status(201).json({ message: "Payment method added successfully!", payment: newPayment });
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

      if (!name || !address) {
          return res.status(400).json({ error: "Name and address are required" });
      }

      const payment = await Payment.findById(id);
      if (!payment) {
          return res.status(404).json({ error: "Payment method not found" });
      }

      let qrCodeUrl = payment.qrCode;
      if (req.file) {
          qrCodeUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }

      payment.name = name;
      payment.address = address;
      payment.qrCode = qrCodeUrl;
      await payment.save();

      res.json({ message: "Payment method updated successfully!", payment });
  } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "Error updating payment method", details: error.message });
  }
};

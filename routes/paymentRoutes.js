const express = require("express");
const { createPayment, getPayments, deletePayment, editPayment } = require("../controllers/paymentController");
const upload = require("../middleware/upload");

const router = express.Router();

// 📌 **1️⃣ Admin: Create Payment Method**
router.post("/create", upload.single("qrCode"), createPayment);

// 📌 **2️⃣ Fetch All Payment Methods**
router.get("/payment", getPayments);

// 📌 **3️⃣ Admin: Delete Payment Method**
router.delete("/:id", deletePayment);

// 📌 **4️⃣ Admin: Edit Payment Method**
router.put("/edit:id", upload.single("qrCode"), editPayment);

module.exports = router;

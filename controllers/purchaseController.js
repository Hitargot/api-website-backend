const multer = require('multer');
const Purchase = require('../models/purchase');  // Import the Purchase model
const { sendEmail } = require('../utils/sendEmail');  // Assuming you have this function
const { sendTelegramNotification } = require('../utils/telegramUtils');  // Import the Telegram notification function

// Multer configuration for receipt upload
const upload = multer({ dest: 'uploads/receipts/' });

exports.createPurchase = [
  // Multer middleware to handle receipt upload
  upload.single('receipt'),

  // Controller logic to save purchase details
  async (req, res) => {
    try {
      const { fullName, email, phone, paymentMethod, serviceName, price } = req.body;
      const receipt = req.file ? `/uploads/receipts/${req.file.filename}` : null;

      // Create a new purchase record with form data and receipt URL
      const newPurchase = new Purchase({
        fullName,
        email,
        phone,
        paymentMethod,
        receipt,
        serviceName,
        price,
      });

      // Save to the database
      await newPurchase.save();

      // Compose the email content (you can use HTML if needed)
      const emailSubject = 'Your Purchase Invoice';
      const emailBody = `
        <p>Dear ${fullName},</p>
        <p>Thank you for your purchase!</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Price:</strong> $${price}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Receipt:</strong> ${receipt ? `<a href="${receipt}">Download Receipt</a>` : 'No receipt uploaded.'}</p>
        <p>Best regards,<br>Your Company Name</p>
      `;

      // Send the email with the details
      await sendEmail(email, emailSubject, emailBody);
      console.log(`Invoice email sent to ${email}`);

      // Send Telegram notification to the admin
      const message = `
        New Purchase Alert:
        Service: ${serviceName}
        Price: $${price}
        Customer: ${fullName}
        Email: ${email}
        Phone: ${phone}
        Payment Method: ${paymentMethod}
        Receipt: ${receipt ? `Download Receipt: ${receipt}` : 'No receipt uploaded.'}
      `;
      await sendTelegramNotification(message);  // Send Telegram message to admin

      // Respond with success message
      res.status(200).json({ message: 'Purchase details saved, email sent!' });
    } catch (error) {
      console.error('Error occurred during purchase creation:', error);  // Detailed error log
      res.status(500).json({ error: 'Error saving purchase details, sending email, or notifying admin', details: error.message });
    }
  },
];

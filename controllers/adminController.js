// controllers/adminController.js
const Purchase = require('../models/purchase');
const { sendEmail } = require('../utils/sendEmail');  // Assuming sendEmail function is set up


exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();  // Fetch all purchases
    res.status(200).json(purchases);  // Send the list of purchases
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching purchases', details: error.message });
  }
};

exports.updatePurchaseStatus = async (req, res) => {
    const { purchaseId, status } = req.body;  // Get purchaseId and status from the request body
    const validStatuses = ['accepted', 'rejected'];
  
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Please use "accepted" or "rejected".' });
    }
  
    try {
      // Find the purchase by ID and update the status
      const updatedPurchase = await Purchase.findByIdAndUpdate(purchaseId, { status }, { new: true });
  
      if (!updatedPurchase) {
        return res.status(404).json({ error: 'Purchase not found.' });
      }
  
      // Send email to user with the result (accepted or rejected)
      const emailSubject = `Your Purchase Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      const emailBody = `
        <p>Dear ${updatedPurchase.fullName},</p>
        <p>Your purchase for the service <strong>${updatedPurchase.serviceName}</strong> has been ${status}.</p>
        <p><strong>Price:</strong> $${updatedPurchase.price}</p>
        <p><strong>Payment Method:</strong> ${updatedPurchase.paymentMethod}</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>Your Company Name</p>
      `;
  
      // Send email to the user informing them of the status change
      await sendEmail(updatedPurchase.email, emailSubject, emailBody);
  
      // Log email sent to console
      console.log(`Email sent to ${updatedPurchase.email} notifying them of purchase ${status}.`);
  
      // Respond with success message
      res.status(200).json({ message: `Purchase ${status} successfully and email sent.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating purchase status or sending email', details: error.message });
    }
  };

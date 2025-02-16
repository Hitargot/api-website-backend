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
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 24px;
          color: #333333;
        }
        .status {
          font-size: 18px;
          color: ${status === 'accepted' ? '#28a745' : '#dc3545'};
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }
        .details {
          margin-bottom: 20px;
        }
        .details p {
          font-size: 16px;
          color: #666666;
          margin: 5px 0;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Purchase Update</h1>
          <p>Dear ${updatedPurchase.fullName},</p>
        </div>

        <div class="status">
          Your purchase has been ${status.charAt(0).toUpperCase() + status.slice(1)}.
        </div>

        <div class="details">
          <p><strong>Service:</strong> ${updatedPurchase.serviceName}</p>
          <p><strong>Price:</strong> $${updatedPurchase.price}</p>
          <p><strong>Payment Method:</strong> ${updatedPurchase.paymentMethod}</p>
        </div>

        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards, <br>Your Company Name</p>
          <p>Website: <a href="http://yourcompany.com">yourcompany.com</a></p>
        </div>
      </div>
    </body>
  </html>
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

// controllers/adminController.js
const Purchase = require('../models/purchase');
const { sendEmail } = require('../utils/sendEmail');  // Assuming sendEmail function is set up
const Service = require('../models/Service'); // Model for services
const ServiceApi = require('../models/ServiceAPI'); // Model storing API keys


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
  const { purchaseId, status } = req.body; 
  const validStatuses = ["accepted", "rejected"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use "accepted" or "rejected".' });
  }

  try {
    // Find the purchase by ID
    const updatedPurchase = await Purchase.findById(purchaseId);
    if (!updatedPurchase) {
      return res.status(404).json({ error: "Purchase not found." });
    }

    // If purchase is accepted, generate an API key
    let apiKey = updatedPurchase.apiKey;
    if (status === "accepted" && !apiKey) {
      // Retrieve the service to get the serviceId
      const service = await Service.findOne({ name: updatedPurchase.serviceName });
    
      if (!service) {
        return res.status(400).json({ error: "Service not found." });
      }
    
      // Retrieve API key from serviceApi model using serviceId
      const serviceApi = await ServiceApi.findOne({ serviceId: service._id });
    
      if (!serviceApi || !serviceApi.apiKey) {
        return res.status(400).json({ error: "API key for this service is not available." });
      }
    
      apiKey = serviceApi.apiKey; // Assign the stored API key
      updatedPurchase.apiKey = apiKey;
    }
    

    // Update the purchase status and save the API key (if generated)
    updatedPurchase.status = status;
    await updatedPurchase.save();

    // Email subject
    const emailSubject = `Your Purchase Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`;

    // Email content
    const emailBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { font-size: 28px; color: #333; }
            .status { font-size: 20px; font-weight: bold; text-align: center; padding: 10px; border-radius: 5px;
                      background-color: ${status === "accepted" ? "#d4edda" : "#f8d7da"};
                      color: ${status === "accepted" ? "#155724" : "#721c24"};
                      margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .details h3 { font-size: 20px; color: #333; }
            .details p { font-size: 16px; color: #666; }
            .purchase-info { margin-bottom: 30px; }
            .purchase-info table { width: 100%; border-collapse: collapse; }
            .purchase-info th, .purchase-info td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .purchase-info th { background-color: #f2f2f2; color: #333; }
            .cta { text-align: center; margin-top: 20px; }
            .cta a { display: inline-block; background-color: ${status === "accepted" ? "#28a745" : "#dc3545"};
                     color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .cta a:hover { opacity: 0.8; }
            .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #777; }
            .api-key { text-align: center; font-size: 18px; font-weight: bold; padding: 10px; background: #f8f9fa;
                       border: 1px solid #ddd; margin-top: 20px; border-radius: 5px; color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Purchase Status Update</h1>
              <p>Dear ${updatedPurchase.fullName},</p>
            </div>
    
            <div class="status">
              Your purchase has been ${status.charAt(0).toUpperCase() + status.slice(1)}.
            </div>
    
            <div class="details">
              <h3>Purchase Details:</h3>
              <table class="purchase-info">
                <tr><th>Service</th><td>${updatedPurchase.serviceName}</td></tr>
                <tr><th>Price</th><td>$${updatedPurchase.price}</td></tr>
                <tr><th>Payment Method</th><td>${updatedPurchase.paymentMethod}</td></tr>
              </table>
            </div>

            ${status === "accepted" ? `
              <div class="api-key">
                <p>Your API Key: <strong>${apiKey}</strong></p>
              </div>
              <div class="cta">
                <p>Use this API key to access the purchased service.</p>
                <a href="http://yourcompany.com/dashboard" target="_blank">View Your API Key</a>
              </div>
            ` : `
              <div class="cta">
                <p>Unfortunately, your purchase was not approved.</p>
                <a href="http://yourcompany.com/support" target="_blank">Contact Support</a>
              </div>
            `}

            <div class="footer">
              <p>If you have any questions, feel free to contact us.</p>
              <p>Best regards, <br>Your Company Name</p>
              <p>Website: <a href="http://yourcompany.com">yourcompany.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to user
    await sendEmail(updatedPurchase.email, emailSubject, emailBody);
    console.log(`Email sent to ${updatedPurchase.email} with API key.`);

    // Respond with success message
    res.status(200).json({ message: `Purchase ${status} successfully. API key sent if accepted.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating purchase status or sending email", details: error.message });
  }
};

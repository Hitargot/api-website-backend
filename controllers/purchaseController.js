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
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"; // Set this to your actual frontend URL
            const receipt = req.file ? `${frontendUrl}/uploads/receipts/${req.file.filename}` : null;

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
                      font-size: 28px;
                      color: #333333;
                    }
                    .details {
                      margin-bottom: 20px;
                    }
                    .details h3 {
                      font-size: 20px;
                      color: #333333;
                    }
                    .details p {
                      font-size: 16px;
                      color: #666666;
                    }
                    .invoice-info {
                      margin-bottom: 30px;
                    }
                    .invoice-info table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .invoice-info th, .invoice-info td {
                      padding: 10px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                    }
                    .invoice-info th {
                      background-color: #f2f2f2;
                      color: #333333;
                    }
                    .cta {
                      text-align: center;
                      margin-top: 20px;
                    }
                    .cta a {
                      display: inline-block;
                      background-color: #28a745;
                      color: white;
                      padding: 10px 20px;
                      text-decoration: none;
                      border-radius: 5px;
                    }
                    .cta a:hover {
                      background-color: #218838;
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
                      <h1>Your Invoice from APIs Marketplace</h1>
                      <p>Thank you for your purchase!</p>
                    </div>
            
                    <div class="details">
                      <h3>Customer Details:</h3>
                      <p><strong>Name:</strong> ${fullName}</p>
                      <p><strong>Email:</strong> ${email}</p>
                      <p><strong>Phone:</strong> ${phone}</p>
                    </div>
            
                    <div class="invoice-info">
                      <h3>Invoice Details:</h3>
                      <table>
                        <tr>
                          <th>Service</th>
                          <td>${serviceName}</td>
                        </tr>
                        <tr>
                          <th>Price</th>
                          <td>$${price}</td>
                        </tr>
                        <tr>
                          <th>Payment Method</th>
                          <td>${paymentMethod}</td>
                        </tr>
                        <tr>
                          <th>Receipt</th>
                          <td>${receipt ? `<a href="${receipt}" target="_blank">Download Receipt</a>` : 'No receipt uploaded.'}</td>
                        </tr>
                      </table>
                    </div>
            
                    <div class="cta">
                      <p>If you have any questions or need further assistance, feel free to contact us.</p>
                      <a href="mailto:mailto:apismarketplace930@gmail.com">Contact Support</a>
                    </div>
            
                    <div class="footer">
                      <p>Best regards, <br>APIs Marketplace</p>
                      <p>Website: <a href="https://api-selling-website.netlify.app">APIs Marketplace</a></p>
                    </div>
                  </div>
                </body>
              </html>
            `;
            
            await sendEmail(email, emailSubject, emailBody);
            console.log(`Invoice email sent to ${email}`);
            
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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if uploads directory exists, if not, create it
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Specify the folder to store the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Get file extension
    cb(null, file.fieldname + '-' + Date.now() + ext); // Generate a unique filename
  }
});

// Initialize Multer with the storage engine
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB for image size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only image files (jpeg, jpg, png, gif) are allowed!');
    }
  }
});

module.exports = upload;

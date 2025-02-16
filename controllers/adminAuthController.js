const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Admin Signup
exports.adminSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let adminExists = await Admin.findOne({ email });
        if (adminExists) return res.status(400).json({ message: "Admin already exists" });

        const newAdmin = new Admin({ username, email, password });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Find admin by either email or username
        const admin = await Admin.findOne({ 
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!admin) return res.status(400).json({ message: "Invalid credentials" });

        console.log("Stored Hashed Password:", admin.password);
        console.log("Entered Password:", password);

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Passwords do not match. Check hashing and saving logic.");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, message: "Admin logged in successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Forgot Password (Send Reset Link)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(404).json({ message: "Admin not found" });

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await admin.save();

        // Send email with reset link (configure Nodemailer)
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

        console.log("🔹 OLD Hashed Password Before Reset:", admin.password);

        // ✅ Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        console.log("✅ NEW Hashed Password:", hashedPassword);

        // ✅ Force update in database
        await Admin.findOneAndUpdate(
            { _id: admin._id },
            { 
                password: hashedPassword, 
                resetPasswordToken: null, 
                resetPasswordExpires: null 
            }
        );

        console.log("✅ Password successfully updated in database!");

        res.json({ message: "Password reset successful. You can now log in with the new password." });
    } catch (error) {
        console.error("❌ Error resetting password:", error.message);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};



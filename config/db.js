const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      retryWrites: true,
      serverSelectionTimeoutMS: 5000 // Timeout for server selection
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

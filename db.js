const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
const DB = async () => {
  try {
    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = DB;

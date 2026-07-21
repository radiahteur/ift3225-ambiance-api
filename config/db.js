const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  console.log("Connexion à MongoDB...");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Erreur MongoDB :", err);
    throw err;
  }
}

module.exports = connectDB;
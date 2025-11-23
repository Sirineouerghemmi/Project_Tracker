// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // Plus besoin des options
    console.log(`MongoDB connecté : ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.error(`Erreur MongoDB : ${err.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
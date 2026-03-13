const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Runtime Error: ${err.message}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Retrying...'.yellow);
    });

  } catch (error) {
    console.error(`❌ Initial Connection Failed: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
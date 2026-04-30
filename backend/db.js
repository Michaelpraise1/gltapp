const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(`Attempted to connect to: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.split('@')[1] || 'Localhost/Unknown' : 'Undefined URI'}`);
    process.exit(1);
  }
};

module.exports = connectDB;

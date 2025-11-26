require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Await the connection to MongoDB
    // Mongoose.connect returns a promise, so we use await to wait for it to resolve.
    await mongoose.connect(process.env.MONGODB_URI);

    // This line will only execute if the connection is successful
    console.log('Successfully connected to MongoDB!');

    // Start the server only AFTER the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    // This block will execute if the connection fails
    console.error('Failed to connect to MongoDB', error);
    // Exit the Node.js process with a failure code (1)
    // This is important for deployment environments to know the app failed to start.
    process.exit(1);
  }
};

startServer();
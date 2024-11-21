const express = require("express");
const mongoose = require("mongoose");
const { mongoURI, port } = require("./config");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use(accountRoutes)

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

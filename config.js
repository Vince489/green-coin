require("dotenv").config();  // Load environment variables from .env

module.exports = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 3000
};

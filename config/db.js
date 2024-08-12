var mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://doniaelhussien:donia123@cluster0.dzxdx.mongodb.net/BookStore?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose;

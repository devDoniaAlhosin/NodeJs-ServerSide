const mongoose = require("mongoose");
const Book = require("../models/books");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("Genre", genreSchema);

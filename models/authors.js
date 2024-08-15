const mongoose = require("mongoose");
const Book = require("../models/books");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  birthDate: { type: String, required: true },
  nationality: { type: String },
  image: { type: String },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

// /Middleware to handle deletion
authorSchema.pre("remove", async function (next) {
  try {
    // Remove references from books
    await Book.updateMany(
      { author: this._id },
      { $pull: { author: this._id } }
    );
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Author", authorSchema);

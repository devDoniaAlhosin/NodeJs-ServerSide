const mongoose = require("mongoose");

const Author = require("../models/authors");
const Genre = require("../models/genres");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  ],
  genre: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
  ],
  description: { type: String },
  published: { type: Date },
  rating: { type: Number },
  reviews_count: { type: Number },
  isbn: { type: String },
  image: { type: String, required: true },
});

// Middleware to handle addition of a book
bookSchema.post("save", async function (doc, next) {
  try {
    const oldGenres = doc.genre;
    const newGenres = doc.genre;

    // Reassign book to new genres
    await Genre.updateMany(
      { _id: { $in: newGenres } },
      { $addToSet: { books: doc._id } }
    );

    // Remove book from old genres
    await Genre.updateMany(
      { _id: { $in: oldGenres } },
      { $pull: { books: doc._id } }
    );
    // Add the book to the author's books array
    await Author.findByIdAndUpdate(doc.author, { $push: { books: doc._id } });
    next();
  } catch (err) {
    console.error("Error updating genres:", err);
    next(err);
  }
});

// Middleware to handle deletion of a book
bookSchema.pre("remove", async function (next) {
  try {
    // Remove the book from the author's books array
    await Author.findByIdAndUpdate(this.author, { $pull: { books: this._id } });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Book", bookSchema);

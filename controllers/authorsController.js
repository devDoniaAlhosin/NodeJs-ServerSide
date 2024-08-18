const { validationResult } = require("express-validator");
const Author = require("../models/authors");
const Book = require("../models/books"); // Adjust the path as necessary
const asyncWrapper = require("../middleware/asyncWrapper");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// All authors
const getallAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// One author
const getauthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.authorId).populate({
      path: "books",
      select: "title description published rating reviews_count  isbn image",
    });

    if (!author) {
      return res.status(404).json({ msg: "Author not found" });
    }

    return res.json(author);
  } catch (err) {
    // Handle specific error cases
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Invalid Object ID" });
    }
    // Handle other unexpected errors
    return res.status(500).json({ msg: err.message });
  }
};

// Add author
const addauthor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update author
const updateAuthor = asyncWrapper(async (req, res) => {
  const authorId = req.params.authorId;

  // Validate authorId
  if (!isValidObjectId(authorId)) {
    return res.status(400).json({ msg: "Invalid author ID format" });
  }

  const updatedAuthor = await Author.findByIdAndUpdate(authorId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedAuthor) {
    return res.status(404).json({ msg: "Author not found" });
  }

  return res.status(200).json(updatedAuthor);
});

// Delete author
const deleteauthor = async (req, res) => {
  const authorId = req.params.authorId;

  // Validate authorId
  if (!isValidObjectId(authorId)) {
    return res.status(400).json({ msg: "Invalid author ID format" });
  }

  try {
    // Remove the author from associated books
    await Book.updateMany(
      { author: authorId },
      { $pull: { author: authorId } }
    );

    // Delete the author
    const result = await Author.deleteOne({ _id: authorId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Author not found" });
    }

    res.status(200).json({ success: true, msg: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while deleting the author",
      error: err.message,
    });
  }
};

module.exports = {
  getallAuthors,
  getauthor,
  addauthor,
  updateAuthor,
  deleteauthor,
};

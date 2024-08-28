const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Genre = require("../models/genres");
const Book = require("../models/books");
const asyncWrapper = require("../middleware/asyncWrapper.js");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add a book to a genre
const addBooksToGenre = asyncWrapper(async (req, res, next) => {
  const genreId = req.params.genreId;
  const { bookIds } = req.body; // Array of book IDs to be added

  // Validate genreId
  if (!isValidObjectId(genreId)) {
    return res.status(400).json({ msg: "Invalid genre ID format" });
  }

  // Validate bookIds
  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res.status(400).json({ msg: "Invalid book IDs format" });
  }

  // Validate if all book IDs exist
  try {
    const books = await Book.find({ _id: { $in: bookIds } });
    if (books.length !== bookIds.length) {
      return res.status(404).json({ msg: "One or more books not found" });
    }

    // Add books to the genre
    const genre = await Genre.findByIdAndUpdate(
      genreId,
      { $addToSet: { books: { $each: bookIds } } }, // Add book IDs, avoiding duplicates
      { new: true }
    ).populate("books"); // Optional: Populate book details

    if (!genre) {
      return res.status(404).json({ msg: "Genre not found" });
    }

    return res.status(200).json(genre);
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});
//All Genres
const getallgenres = asyncWrapper(async (req, res) => {
  const genres = await Genre.find().populate({
    path: "books",
    populate: [
      {
        path: "author",
        select: "name bio  birthDate nationality  image  books",
      },
      { path: "genre", select: "name description" },
    ],
  });
  res.json(genres);
});

//Single Genre
const getgenre = asyncWrapper(async (req, res) => {
  const genreId = req.params.genreId;
  console.log(`Fetching genre with ID: ${genreId}`);

  if (!mongoose.Types.ObjectId.isValid(genreId)) {
    return res.status(400).json({ msg: "Invalid genre ID format" });
  }

  try {
    const genre = await Genre.findById(genreId).populate("books");

    if (!genre) {
      console.log(`Genre with ID ${genreId} not found`);
      return res.status(404).json({ msg: "Genre not found" });
    }

    console.log(`Found genre: ${JSON.stringify(genre)}`);
    res.status(200).json(genre);
  } catch (error) {
    console.error(`Error fetching genre: ${error.message}`);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

//Add genre
const addgenre = async (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const newGenre = new Genre(req.body);
  await newGenre.save();

  res.status(201).json(newGenre);
};

//Update genre
const updategenre = async (req, res) => {
  const genreId = req.params.genreId;

  try {
    const updatedgenre = await Genre.findByIdAndUpdate(genreId, req.body, {
      new: true,
      runValidators: true,
    }).populate("books");

    if (!updatedgenre) {
      return res.status(404).json({ msg: "Genre not found" });
    }

    return res.status(200).json(updatedgenre);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

//Delete genre
const deletegenre = async (req, res) => {
  const genreId = req.params.genreId;
  const defaultGenreId = "66bd24f5acb9c33f46a7723c";

  if (
    !mongoose.Types.ObjectId.isValid(genreId) ||
    !mongoose.Types.ObjectId.isValid(defaultGenreId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid genre ID or default genre ID" });
  }

  try {
    // Validate if the default genre exists
    const defaultGenre = await Genre.findById(defaultGenreId);
    if (!defaultGenre) {
      return res.status(404).json({ message: "Default genre not found" });
    }

    // Find the genre to be deleted
    const genre = await Genre.findById(genreId);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    // Reassign books to the default genre
    const result = await Book.updateMany(
      { genre: genreId },
      { $set: { genre: defaultGenreId } } // Replace the old genre with the default genre
    );

    // if (result.modifiedCount === 0) {
    //   return res.status(404).json({ message: "No books were reassigned" });
    // }

    // Update the default genre's books array
    const books = await Book.find({ genre: defaultGenreId });
    const bookIds = books.map((book) => book._id);

    await Genre.findByIdAndUpdate(defaultGenreId, { $set: { books: bookIds } });

    // Delete the genre
    await Genre.findByIdAndDelete(genreId);

    res
      .status(200)
      .json({ success: true, message: "Genre deleted and books reassigned" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getallgenres,
  getgenre,
  addgenre,
  updategenre,
  deletegenre,
  addBooksToGenre,
};

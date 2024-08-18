// const { validationResult } = require("express-validator");
// const Book = require("../models/books");
// const Author = require("../models/authors");
// const Genre = require("../models/genres");
// // const appError = require("../utilities/appError");
// const httpStatusText = require("../utilities/httpStatusText");
// const mongoose = require("mongoose");

// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// // All books
// const getallbooks = async (req, res) => {
//   try {
//     const books = await Book.find()
//       .populate("author", "name") // Populate author field with name
//       .populate("genre", "name"); // Populate genre field with name

//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get Single Book
// const getbook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.bookID)
//       .populate("author", "name")
//       .populate("genre", "name");

//     if (!book) return res.status(404).json({ message: "Book not found" });

//     res.json(book);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// //Add book
// const addbook = async (req, res) => {
//   console.log("Request body:", req.body);
//   console.log("Author model:", Author);

//   const errors = validationResult(req);
//   const customErrors = {
//     invalidAuthorIds: [],
//     invalidGenreIds: [],
//   };

//   if (!errors.isEmpty()) {
//     errors.array().forEach((err) => {
//       if (err.param === "author") {
//         customErrors.invalidAuthorIds.push(err.value);
//       } else if (err.param === "genre") {
//         customErrors.invalidGenreIds.push(err.value);
//       }
//     });
//   }

//   const {
//     title,
//     author,
//     genre,
//     description,
//     published,
//     rating,
//     reviews_count,
//     isbn,
//     image,
//   } = req.body;

//   try {
//     // Validate author IDs
//     if (author && author.length > 0) {
//       const invalidAuthorIds = author.filter((id) => !isValidObjectId(id));
//       if (invalidAuthorIds.length > 0) {
//         customErrors.invalidAuthorIds.push(...invalidAuthorIds);
//       }

//       const validAuthorIds = author.filter((id) => isValidObjectId(id));
//       if (validAuthorIds.length > 0) {
//         const validAuthors = await Author.find({
//           _id: { $in: validAuthorIds },
//         });
//         const validAuthorIdsSet = new Set(
//           validAuthors.map((a) => a._id.toString())
//         );
//         const nonExistentAuthors = validAuthorIds.filter(
//           (id) => !validAuthorIdsSet.has(id)
//         );
//         if (nonExistentAuthors.length > 0) {
//           customErrors.invalidAuthorIds.push(...nonExistentAuthors);
//         }
//       }
//     }

//     // Validate genre IDs
//     if (genre && genre.length > 0) {
//       const invalidGenreIds = genre.filter((id) => !isValidObjectId(id));
//       if (invalidGenreIds.length > 0) {
//         customErrors.invalidGenreIds.push(...invalidGenreIds);
//       }

//       const validGenreIds = genre.filter((id) => isValidObjectId(id));
//       if (validGenreIds.length > 0) {
//         const validGenres = await Genre.find({ _id: { $in: validGenreIds } });
//         const validGenreIdsSet = new Set(
//           validGenres.map((g) => g._id.toString())
//         );
//         const nonExistentGenres = validGenreIds.filter(
//           (id) => !validGenreIdsSet.has(id)
//         );
//         if (nonExistentGenres.length > 0) {
//           customErrors.invalidGenreIds.push(...nonExistentGenres);
//         }
//       }
//     }

//     // Return combined errors if any
//     if (
//       customErrors.invalidAuthorIds.length > 0 ||
//       customErrors.invalidGenreIds.length > 0
//     ) {
//       return res.status(400).json({
//         error: {
//           invalidAuthorIds:
//             customErrors.invalidAuthorIds.length > 0
//               ? customErrors.invalidAuthorIds
//               : undefined,
//           invalidGenreIds:
//             customErrors.invalidGenreIds.length > 0
//               ? customErrors.invalidGenreIds
//               : undefined,
//         },
//       });
//     }

//     // Create and save the new book if all IDs are valid
//     const newBook = new Book({
//       title,
//       author,
//       genre,
//       description,
//       published,
//       rating,
//       reviews_count,
//       isbn,
//       image,
//     });
//     await newBook.save();

//     // Update the genres to include the new book
//     await Genre.updateMany(
//       { _id: { $in: genre } },
//       { $addToSet: { books: newBook._id } }
//     );

//     res.status(201).json(newBook);
//   } catch (err) {
//     // Handle unexpected errors
//     if (err.name === "CastError") {
//       return res.status(400).json({
//         error: {
//           message: "Invalid ID format",
//           details: err.message,
//         },
//       });
//     }
//     res.status(500).json({ error: err.message });
//   }
// };
// //Update books
// const updatebook = async (req, res) => {
//   const bookID = req.params.bookID;
//   const updates = req.body;

//   // Validate request body
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json(errors.array());
//   }

//   try {
//     let invalidAuthorIds = [];
//     let invalidGenreIds = [];

//     // Validate author IDs
//     if (updates.author && updates.author.length > 0) {
//       const authorIds = updates.author;
//       const validAuthorIds = authorIds.every((id) =>
//         mongoose.Types.ObjectId.isValid(id)
//       );
//       if (!validAuthorIds) {
//         invalidAuthorIds = authorIds.filter(
//           (id) => !mongoose.Types.ObjectId.isValid(id)
//         );
//       } else {
//         const validAuthors = await Author.find({ _id: { $in: authorIds } });
//         if (validAuthors.length !== authorIds.length) {
//           invalidAuthorIds = authorIds.filter(
//             (id) => !validAuthors.some((author) => author._id.toString() === id)
//           );
//         }
//       }
//     }

//     // Validate genre IDs
//     if (updates.genre && updates.genre.length > 0) {
//       const genreIds = updates.genre;
//       const validGenreIds = genreIds.every((id) =>
//         mongoose.Types.ObjectId.isValid(id)
//       );
//       if (!validGenreIds) {
//         invalidGenreIds = genreIds.filter(
//           (id) => !mongoose.Types.ObjectId.isValid(id)
//         );
//       } else {
//         const validGenres = await Genre.find({ _id: { $in: genreIds } });
//         if (validGenres.length !== genreIds.length) {
//           invalidGenreIds = genreIds.filter(
//             (id) => !validGenres.some((genre) => genre._id.toString() === id)
//           );
//         }
//       }
//     }

//     // Return errors if any invalid IDs
//     if (invalidAuthorIds.length > 0 || invalidGenreIds.length > 0) {
//       return res.status(400).json({
//         error: {
//           invalidAuthorIds:
//             invalidAuthorIds.length > 0 ? invalidAuthorIds : undefined,
//           invalidGenreIds:
//             invalidGenreIds.length > 0 ? invalidGenreIds : undefined,
//         },
//       });
//     }

//     // Find the current book to get the current author and genre
//     const currentBook = await Book.findById(bookID).populate("author genre");

//     if (!currentBook) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     const oldAuthorIds = currentBook.author.map((author) => author._id);
//     const newAuthorIds = updates.author || oldAuthorIds;

//     const oldGenreIds = currentBook.genre.map((genre) => genre._id);
//     const newGenreIds = updates.genre || oldGenreIds;

//     // Update the book with new author(s) and genre(s)
//     const updatedBook = await Book.findByIdAndUpdate(bookID, updates, {
//       new: true,
//     })
//       .populate("author", "name")
//       .populate("genre", "name");

//     // Handle the author reassignment
//     if (newAuthorIds) {
//       // Remove the book from the old author's book list
//       await Author.updateMany(
//         { _id: { $in: oldAuthorIds } },
//         { $pull: { books: bookID } }
//       );

//       // Add the book to the new author's book list
//       await Author.updateMany(
//         { _id: { $in: newAuthorIds } },
//         { $addToSet: { books: bookID } }
//       );
//     }

//     // Handle the genre reassignment
//     if (newGenreIds) {
//       // Remove the book from the old genre's book list
//       await Genre.updateMany(
//         { _id: { $in: oldGenreIds } },
//         { $pull: { books: bookID } }
//       );

//       // Add the book to the new genre's book list
//       await Genre.updateMany(
//         { _id: { $in: newGenreIds } },
//         { $addToSet: { books: bookID } }
//       );
//     }

//     res.status(200).json(updatedBook);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// //Delete books
// const deletebook = async (req, res) => {
//   console.log("Request parameters:", req.params);
//   const bookId = req.params.bookID;

//   // Log the bookId
//   console.log("Book ID:", bookId);

//   // Check if the bookId is valid
//   if (!isValidObjectId(bookId)) {
//     return res.status(400).json({ message: "Invalid book ID format" });
//   }

//   try {
//     // Remove the book from genres
//     await Genre.updateMany({ books: bookId }, { $pull: { books: bookId } });

//     // Remove the book from authors if applicable
//     await Author.updateMany({ books: bookId }, { $pull: { books: bookId } });

//     // Delete the book
//     const deletedBook = await Book.findByIdAndDelete(bookId);

//     if (!deletedBook) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     res.status(200).json({ success: true });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   getallbooks,
//   getbook,
//   addbook,
//   updatebook,
//   deletebook,
// };

const { validationResult } = require("express-validator");
const Book = require("../models/books");
const Author = require("../models/authors");
const Genre = require("../models/genres");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// All books
const getallbooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate({
        path: "author",
        select: "name bio birthDate nationality image books",
        populate: {
          path: "books",
          select:
            "title description published rating reviews_count  isbn image",
        },
      })
      .populate({
        path: "genre",
        select: "name description books",
        populate: {
          path: "books",
          select:
            "title description published rating reviews_count  isbn image",
        },
      });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Book
const getbook = async (req, res) => {
  try {
    // Find the book and populate author and genre details
    const book = await Book.findById(req.params.bookID)
      .populate({
        path: "author",
        select: "name bio birthDate nationality image books",
        populate: {
          path: "books",
          select:
            "title description published rating reviews_count  isbn image", // Select fields of the books
        },
      })
      .populate({
        path: "genre",
        select: "name description books",
      });

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add book
const addbook = async (req, res) => {
  const errors = validationResult(req);
  const customErrors = {
    invalidAuthorIds: [],
    invalidGenreIds: [],
  };

  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      if (err.param === "author") {
        customErrors.invalidAuthorIds.push(err.value);
      } else if (err.param === "genre") {
        customErrors.invalidGenreIds.push(err.value);
      }
    });
  }

  const {
    title,
    author,
    genre,
    description,
    published,
    rating,
    reviews_count,
    isbn,
    image,
  } = req.body;

  try {
    // Validate author IDs
    if (author && author.length > 0) {
      const invalidAuthorIds = author.filter((id) => !isValidObjectId(id));
      if (invalidAuthorIds.length > 0) {
        customErrors.invalidAuthorIds.push(...invalidAuthorIds);
      }

      const validAuthorIds = author.filter((id) => isValidObjectId(id));
      if (validAuthorIds.length > 0) {
        const validAuthors = await Author.find({
          _id: { $in: validAuthorIds },
        });
        const validAuthorIdsSet = new Set(
          validAuthors.map((a) => a._id.toString())
        );
        const nonExistentAuthors = validAuthorIds.filter(
          (id) => !validAuthorIdsSet.has(id)
        );
        if (nonExistentAuthors.length > 0) {
          customErrors.invalidAuthorIds.push(...nonExistentAuthors);
        }
      }
    }

    // Validate genre IDs
    if (genre && genre.length > 0) {
      const invalidGenreIds = genre.filter((id) => !isValidObjectId(id));
      if (invalidGenreIds.length > 0) {
        customErrors.invalidGenreIds.push(...invalidGenreIds);
      }

      const validGenreIds = genre.filter((id) => isValidObjectId(id));
      if (validGenreIds.length > 0) {
        const validGenres = await Genre.find({ _id: { $in: validGenreIds } });
        const validGenreIdsSet = new Set(
          validGenres.map((g) => g._id.toString())
        );
        const nonExistentGenres = validGenreIds.filter(
          (id) => !validGenreIdsSet.has(id)
        );
        if (nonExistentGenres.length > 0) {
          customErrors.invalidGenreIds.push(...nonExistentGenres);
        }
      }
    }

    // Return combined errors if any
    if (
      customErrors.invalidAuthorIds.length > 0 ||
      customErrors.invalidGenreIds.length > 0
    ) {
      return res.status(400).json({
        error: {
          invalidAuthorIds:
            customErrors.invalidAuthorIds.length > 0
              ? customErrors.invalidAuthorIds
              : undefined,
          invalidGenreIds:
            customErrors.invalidGenreIds.length > 0
              ? customErrors.invalidGenreIds
              : undefined,
        },
      });
    }

    // Create and save the new book if all IDs are valid
    const newBook = new Book({
      title,
      author,
      genre,
      description,
      published,
      rating,
      reviews_count,
      isbn,
      image,
    });
    await newBook.save();

    // Update the genres to include the new book
    await Genre.updateMany(
      { _id: { $in: genre } },
      { $addToSet: { books: newBook._id } }
    );

    // Update the authors to include the new book
    await Author.updateMany(
      { _id: { $in: author } },
      { $addToSet: { books: newBook._id } }
    );

    res.status(201).json(newBook);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        error: {
          message: "Invalid ID format",
          details: err.message,
        },
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update books
const updatebook = async (req, res) => {
  const bookID = req.params.bookID;
  const updates = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  try {
    let invalidAuthorIds = [];
    let invalidGenreIds = [];

    // Validate author IDs
    if (updates.author && updates.author.length > 0) {
      const authorIds = updates.author;
      const validAuthorIds = authorIds.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!validAuthorIds) {
        invalidAuthorIds = authorIds.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
      } else {
        const validAuthors = await Author.find({ _id: { $in: authorIds } });
        if (validAuthors.length !== authorIds.length) {
          invalidAuthorIds = authorIds.filter(
            (id) => !validAuthors.some((author) => author._id.toString() === id)
          );
        }
      }
    }

    // Validate genre IDs
    if (updates.genre && updates.genre.length > 0) {
      const genreIds = updates.genre;
      const validGenreIds = genreIds.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!validGenreIds) {
        invalidGenreIds = genreIds.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
      } else {
        const validGenres = await Genre.find({ _id: { $in: genreIds } });
        if (validGenres.length !== genreIds.length) {
          invalidGenreIds = genreIds.filter(
            (id) => !validGenres.some((genre) => genre._id.toString() === id)
          );
        }
      }
    }

    // Return errors if any invalid IDs
    if (invalidAuthorIds.length > 0 || invalidGenreIds.length > 0) {
      return res.status(400).json({
        error: {
          invalidAuthorIds:
            invalidAuthorIds.length > 0 ? invalidAuthorIds : undefined,
          invalidGenreIds:
            invalidGenreIds.length > 0 ? invalidGenreIds : undefined,
        },
      });
    }

    // Find the current book to get the current author and genre
    const currentBook = await Book.findById(bookID).populate("author genre");

    if (!currentBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const oldAuthorIds = currentBook.author.map((author) => author._id);
    const newAuthorIds = updates.author || oldAuthorIds;

    const oldGenreIds = currentBook.genre.map((genre) => genre._id);
    const newGenreIds = updates.genre || oldGenreIds;

    // Update the book with new author(s) and genre(s)
    const updatedBook = await Book.findByIdAndUpdate(bookID, updates, {
      new: true,
    })
      .populate("author")
      .populate("genre");

    // Handle the author reassignment
    if (newAuthorIds) {
      // Remove the book from the old author's book list
      await Author.updateMany(
        { _id: { $in: oldAuthorIds } },
        { $pull: { books: bookID } }
      );

      // Add the book to the new author's book list
      await Author.updateMany(
        { _id: { $in: newAuthorIds } },
        { $addToSet: { books: bookID } }
      );
    }

    // Handle the genre reassignment
    if (newGenreIds) {
      // Remove the book from the old genre's book list
      await Genre.updateMany(
        { _id: { $in: oldGenreIds } },
        { $pull: { books: bookID } }
      );

      // Add the book to the new genre's book list
      await Genre.updateMany(
        { _id: { $in: newGenreIds } },
        { $addToSet: { books: bookID } }
      );
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete books
const deletebook = async (req, res) => {
  const bookId = req.params.bookID;

  if (!isValidObjectId(bookId)) {
    return res.status(400).json({ message: "Invalid book ID format" });
  }

  try {
    // Remove the book from genres
    await Genre.updateMany({ books: bookId }, { $pull: { books: bookId } });

    // Remove the book from authors if applicable
    await Author.updateMany({ books: bookId }, { $pull: { books: bookId } });

    // Delete the book
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getallbooks,
  getbook,
  addbook,
  updatebook,
  deletebook,
};

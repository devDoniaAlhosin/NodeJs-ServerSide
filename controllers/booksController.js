const { validationResult } = require("express-validator");
const Book = require("../models/books");
// All books
const getallbooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};
// const getallbooks = async (req, res) => {
//   try {
//       const books = await Book.find().populate('author').populate('genre');
//       res.json(books);
//   } catch (err) {
//       res.status(500).json({ message: err.message });
//   }
// };

const getbook = async (req, res) => {
  try {
      const book = await Book.findById(req.params.bookID).populate('author').populate('genre');
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};
/** 
* Paste one or more documents here
*/
// [
//   {
//     "title": "Heart of Darkness",
//     "genre": ObjectId("60c72b2f5f1b2c001c8e4e1a"), 
//     "description": "A novella exploring the darkness within human nature.",
//     "published": { "$date": "1899-02-01T00:00:00Z" },
//     "image":"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1392799983i/4900.jpg",
//     "author": ObjectId("66bb6513e75538eb09b0bb4f") 
//   },
//   {
//     "title": "Lord Jim",
//     "genre": ObjectId("60c72b2f5f1b2c001c8e4e1a"),
//     "description": "A novel about a young man’s journey and quest for redemption.",
//     "published": { "$date": "1900-10-01T00:00:00Z" },
//     "image":"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1372366969i/12194.jpg",
//     "author": ObjectId("66bb6513e75538eb09b0bb4f"),
//   },
//   {
//     "title": "Nostromo",
//     "genre": ObjectId("60c72b2f5f1b2c001c8e4e1c"), 
//     "description": "A novel that portrays the political and economic struggle of a South American country.",
//     "published": { "$date": "1904-01-01T00:00:00Z" },
//     "image":"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328865264i/115476.jpg",
//     "author": ObjectId("66bb6513e75538eb09b0bb4f") ,
//   },
//   {
//     "title": "The Secret Agent",
//     "genre": ObjectId("60c72b2f5f1b2c001c8e4e1d"), 
//     "description": "A novel about political espionage and terrorism.",
//     "published": { "$date": "1907-09-01T00:00:00Z" },
//     "image":"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1171075859i/86658.jpg",
//     "author": ObjectId("66bb6513e75538eb09b0bb4f") ,
//   }
// ]


// Single book
// const getbook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.bookID);
//     if (!book) {
//       return res.status(404).json({ msg: "book not found" });
//     }
//     return res.json(book);
//   } catch (err) {
//     return res.status(400).json({ msg: "invalid Object ID" });
//   }
// };
//Add book
const addbook = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
    const newBook = new Book(req.body);
    await newBook.save();
  }
  res.status(201).json(newBook);
};

//Update books
const updatebook = async (req, res) => {
  const bookID = req.params.bookID;

  try {
    const updatedbook = await Book.updateOne({_id:bookID}, {
      $set: { ...req.body },
    });

    return res.status(200).json(updatedbook);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

//Delete books
const deletebook = async (req, res) => {
const deleted=await Book.deleteOne({_id:req.params.bookID})
  res.status(200).json({ success: true });
};

module.exports = {
  getallbooks,
  getbook,
  addbook,
  updatebook,
  deletebook,
};

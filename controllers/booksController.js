const { validationResult } = require("express-validator");
const Book = require("../models/books");
//All books
const getallbooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};
//Single book
const getbook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookID);
    if (!book) {
      return res.status(404).json({ msg: "book not found" });
    }
    return res.json(book);
  } catch (err) {
    return res.status(400).json({ msg: "invalid Object ID" });
  }
};
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
  const bookId = req.params.bookId;

  try {
    const updatedbook = await Book.updateOne({_id:bookId}, {
      $set: { ...req.body },
    });

    return res.status(200).json(updatedbook);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

//Delete books
const deletebook = async (req, res) => {
const deleted=await Book.deleteOne({_id:req.params.bookId})
  res.status(200).json({ success: true });
};
module.exports = {
  getallbooks,
  getbook,
  addbook,
  updatebook,
  deletebook,
};

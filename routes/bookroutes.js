const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { body } = require("express-validator");
const { booksValidation } = require("../middleware/books");
const { authorsController } = require("../controllers/authorsController");
const { genresController } = require("../controllers/genresController");
const { genrerouters } = require("../routes/genre.route");
const Book = require("../models/books");
router
  .route("/")
  .get(booksController.getallbooks)
  .post(booksValidation(), booksController.addbook);

router
  .route("/:bookID")
  .get(booksController.getbook)
  .patch(booksController.updatebook)
  .delete(booksController.deletebook);

// router.get('/books/:bookID', getbook);
module.exports = router;

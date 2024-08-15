const { body } = require("express-validator");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const booksValidation = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 2 })
      .withMessage("Title must be at least 2 characters long"),
    body("author")
      .isArray()
      .withMessage("Author must be an array")
      .custom((authors) =>
        authors.every((id) => mongoose.Types.ObjectId.isValid(id))
      )
      .withMessage("Invalid author ID format"),
    body("genre")
      .isArray()
      .withMessage("Genre must be an array")
      .custom((genres) =>
        genres.every((id) => mongoose.Types.ObjectId.isValid(id))
      )
      .withMessage("Invalid genre ID format"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("published")
      .optional()
      .isISO8601()
      .withMessage("Published date must be in ISO8601 format"),
    body("rating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be a number between 0 and 5"),
    body("reviews_count")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Reviews count must be a non-negative integer"),
    body("isbn")
      .optional()
      .isISBN()
      .withMessage("ISBN must be a valid ISBN number"),
    body("image")
      .notEmpty()
      .withMessage("Image is required")
      .isURL()
      .withMessage("Image must be a valid URL"),
  ];
};

module.exports = {
  booksValidation,
};

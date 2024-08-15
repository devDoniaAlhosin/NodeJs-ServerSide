const router = require("../routes/genre.route");
const { body } = require("express-validator");
const genreValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 2 })
      .withMessage("title at least is 2 digits"),

    body("description")
      .optional()
      .notEmpty()
      .withMessage("The description must not be empty if provided"),
  ];
};
module.exports = {
  genreValidation,
};

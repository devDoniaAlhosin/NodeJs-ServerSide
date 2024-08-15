const router = require("../routes/authors.route");
const { body } = require("express-validator");

const authorValidation = () => {
  return [
    body("name").notEmpty().withMessage("The name of the author is needed"),

    body("bio")
      .optional()
      .isLength({ min: 7 })
      .withMessage("The bio must be at least 7 characters"),

    body("birthDate").notEmpty().withMessage("The birthDate is required"),

    body("nationality")
      .optional()
      .isLength({ min: 2 })
      .withMessage("The nationality must be at least 2 characters"),
  ];
};

module.exports = {
  authorValidation,
};

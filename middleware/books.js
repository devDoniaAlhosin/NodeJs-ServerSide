const router = require("../routes/bookroutes");
const {body}=require("express-validator")
const booksValidation=()=>{
    return[
        body ('title')
        .notEmpty()
        .withMessage("title is required")
        .isLength({min:2})
        .withMessage("title at least is 2 digits"),

        body('author')
        .notEmpty()
        .withMessage("the author name is required")
    ]
}
module.exports={
    booksValidation
}
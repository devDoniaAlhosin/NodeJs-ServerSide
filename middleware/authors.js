const router=require('../routes/authors.route');
const{body}=require("express-validator");
const authorValidation=()=>{
    return[
        body('name')
        .notEmpty()
        .withMessage("the name of the author is needed"),

        body('bio')
        .notEmpty()
        .withMessage("the bio is required")
        .isLength({min:7})
        .withMessage("the bio must be at least 7 characters"),

        body('birthDate')
        .notEmpty()
        .withMessage("the birthDate is required"),

        body(' nationality')
        .notEmpty()
        .withMessage("the nationality is required")
    ]
}
module.exports={
    authorValidation
}
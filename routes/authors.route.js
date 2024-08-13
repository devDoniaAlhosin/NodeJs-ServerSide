const express=require("express");
const router=express.Router();
const authorsController=require("../controllers/authorsController");
const{body}=require('express-validator');
const{authorValidation}=require("../middleware/authors");

router.route('/')
.get(authorsController.getallAuthors)
.post(authorValidation(),authorsController.addauthor)



router.route('/:authorId')
.get(authorsController.getauthor)
.patch(authorsController.updateAuthor)
.delete(authorsController.deleteauthor)

module.exports=router;




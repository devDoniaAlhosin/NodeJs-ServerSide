const express = require('express');
const router = express.Router();
const booksController=require('../controllers/booksController');
const{body}=require('express-validator');
const{booksValidation}=require('../middleware/books')

router.route('/')
.get(booksController.getallbooks)
    .post( booksValidation(),booksController.addbook)

router.route('/:bookID')
.get(booksController.getbook)
.patch(booksController.updatebook)
.delete(booksController.deletebook)


module.exports = router;
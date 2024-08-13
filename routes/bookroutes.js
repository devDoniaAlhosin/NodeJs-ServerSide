const express = require('express');
const router = express.Router();
const booksController=require('../controllers/booksController');
const{body}=require('express-validator');
const{booksValidation}=require('../middleware/books')
const{authorsController}=require('../controllers/authorsController');
const{genresController}=require('../controllers/genresController');
const {genrerouters}=require("../routes/genre.route")
const Book=require('../models/books')
router.route('/')
.get(booksController.getallbooks)
    .post( booksValidation(),booksController.addbook)

    // router.get('/genre/:genreId', async (req, res) => {
    //     try {
    //         const { genreId } = req.params;
    //         const books = await Book.find({ genre: genreId }).populate('author').populate('genre');
    //         res.json(books);
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // });

router.route('/:bookID')
.get(booksController.getbook)
.patch(booksController.updatebook)
.delete(booksController.deletebook)

module.exports = router;
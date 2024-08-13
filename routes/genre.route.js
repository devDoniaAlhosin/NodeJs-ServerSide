const express = require('express');
const router = express.Router({mergeParams:true});
const genresController=require('../controllers/genresController');
const{body}=require('express-validator');
const{genreValidation}=require('../middleware/genres')

router.route('/')
.get(genresController.getallgenres)
    .post( genreValidation(),genresController.addgenre)

router.route('/:genreId')
.get(genresController.getgenre)
.patch(genresController.updategenre)
.delete(genresController.deletegenre)


module.exports = router ;
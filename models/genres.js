const mongoose=require('mongoose');
// const bookSchema=require("../models/books")
const genresSchema=new mongoose.Schema({
    name: String,
    description: String,
    books:[{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
})

module .exports=mongoose.model('Genre',genresSchema);
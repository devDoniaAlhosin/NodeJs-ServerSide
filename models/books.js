const mongoose=require('mongoose');
const bookSchema=new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    description: String,
    published: String,
    rating: Number,
    reviews_count: Number,
    isbn: String,
    image: String
})
module.exports=mongoose.model('Book',bookSchema);
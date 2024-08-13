const mongoose=require('mongoose');
const bookSchema=new mongoose.Schema({
    title: String,
    author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
    genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    description: String,
    published: Date,
    rating: Number,
    reviews_count: Number,
    isbn: String,
    image: String
})
module.exports=mongoose.model('Book',bookSchema);
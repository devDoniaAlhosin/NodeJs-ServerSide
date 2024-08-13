const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const {body,validationResult}=require('express-validator')
const bookController=require('./controllers/booksController');
const authorsController=require('./controllers/authorsController');
const genresConttroller=require('./controllers/genresController');
const booksrouters=require('./routes/bookroutes');
const authorsrouters=require('./routes/authors.route');
const genresrouters=require('./routes/genre.route');




// Use the routes
app.use('/api/books',booksrouters);
app.use('/api/authors',authorsrouters);
app.use('/api/genres',genresrouters);

//connection with DB
const mongoose=require('mongoose');
const url='mongodb+srv://doniaelhussien:donia123@cluster0.dzxdx.mongodb.net/BookStore?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(url).then(()=>{
  console.log("mongodb server started")
  })



// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB Atlas');
// }).catch(err => {
//   console.error('Failed to connect to MongoDB Atlas', err);
// });

  


// router.get('/authors/:authorId/books', async (req, res) => {
//   try {
//     const books = await Book.find({ author: req.params.authorId }).populate('author').populate('genre');
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get books by genre
// router.get('/genres/:genreId/books', async (req, res) => {
//   try {
//     const books = await Book.find({ genre: req.params.genreId }).populate('author').populate('genre');
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// Start the server
app.listen(3000, function() {
  console.log('running on port 3000');
});

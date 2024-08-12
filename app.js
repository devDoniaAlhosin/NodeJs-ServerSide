const express = require('express');
const app = express();
// const cors = require('cors');

var bodyParser = require('body-parser');
const {body,validationResult}=require('express-validator')
const bookController=require('./controllers/booksController')
const booksrouters=require('./routes/bookroutes')




// Use the routes
app.use('/api/books',booksrouters)
// app.use('/api/authors',authorsRoutes)

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

  
app.use(bodyParser.json());
// app.use(cors());




// Start the server
app.listen(3000, function() {
  console.log('running on port 3000');
});

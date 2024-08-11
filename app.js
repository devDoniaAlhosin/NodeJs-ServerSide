var express = require('express');
var bodyParser = require('body-parser');
const bookController=require('../controllers/booksController')
// var db = require('./config/db');  // Import the database connection
// var bookRoutes = require('./routes/bookroutes'); // Import the routes

var app = express();

app.use(bodyParser.json());

// Use the routes
// app.use('/', bookRoutes);


// Start the server
app.listen(3000, function() {
  console.log('running on port 3000');
});

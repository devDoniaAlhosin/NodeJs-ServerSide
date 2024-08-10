// var express=require('express');
// var app=express();
// var bodyParser=require('body-parser');
// var mongoose=require('mongoose');

// //connect to Mongoose
// mongoose.connect('mongodb://localhost/bookstore');
// var db=mongoose.connection

// app.get('/',function(req,res){
// res.send('hello nodemon ');
// });

// app.listen(3000)
// console.log('running on port 3000')

var express = require('express');
var bodyParser = require('body-parser');
var db = require('./config/db');  // Import the database connection
var bookRoutes = require('./routes/bookroutes'); // Import the routes

var app = express();

app.use(bodyParser.json());

// Use the routes
app.use('/', bookRoutes);

// Start the server
app.listen(3000, function() {
  console.log('running on port 3000');
});

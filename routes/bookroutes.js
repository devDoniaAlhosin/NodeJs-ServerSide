// routes/bookRoutes.js
var express = require('express');
var router = express.Router();
// const books
// Define your route here
router.get('/', function(req, res) {
  res.send('hello nodemon');
});

module.exports = router;
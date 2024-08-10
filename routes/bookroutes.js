// routes/bookRoutes.js
var express = require('express');
var router = express.Router();

// Define your route here
router.get('/', function(req, res) {
  res.send('hello nodemon');
});

module.exports = router;
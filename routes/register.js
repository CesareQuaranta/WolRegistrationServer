var express = require('express');
var app = require('../server');
var bodyParser = require("body-parser");
var router = express.Router();
var db= app.get('db');
var users = db.get('users');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
router.put('/', function(req, res) {
  console.log(req.body);
  var rName = req.body.name;
});

module.exports = router;

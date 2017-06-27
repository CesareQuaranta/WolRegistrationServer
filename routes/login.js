var express = require('express');
var app = require('../server');
var router = express.Router();
var db= app.get('db');
var keychain = db.get('keychain');
var stats = db.get('stats');
var RSA= app.get('RSA-Public');
var ursa = require('ursa');

// middleware to use for all requests
/*router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});*/
/*
db.createCollection("stats")
db.keychain.save({ email: 'cesare.quaranta@gmail.com', secret:"testSecreto" });
*/
router.post('/', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  console.log(req.body);
  var rEmail= req.body.email;
  var rPassword = req.body.pwd;
  //https://github.com/un33k/node-ipware
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  var user ={'email': rEmail};
  keychain.findOne(user).then((result) => {
          if(!!result){
            user.secret = result.secret;
            user.id= result._id;
            if(user.secret === rPassword){
              var now = new Date();
              console.log('Login User:'+user.email);
              var token=user.email+"|"+ip+"|"+now.getTime();
              console.log('Token:'+token);
              var crypToken = RSA.encrypt(token, 'utf8','base64',ursa.RSA_PKCS1_PADDING);
              console.log('CrypToken:'+crypToken);
              res.status(200);
              res.json({Token:crypToken,accessPoint:'ws://64.137.241.9:28080/wol/ws'});
              stats.insert({ 'email': rEmail, 'ip':ip, 'timestamp': now.getTime()});
              //res.json({Token:crypToken,accessPoint:'ws://localhost:8080/wol/ws'});
            }else{
              res.status(501);
              res.json({Error:'Password errata per '+user.email});
              console.log('Password errata per '+user.email);
            }
          }else{
              res.status(404);
              res.json({Error:'No User:'+user.email+' found'});
              console.log('No User:'+user.email+' found');
          }
      });
  
});

module.exports = router;

// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = module.exports = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require("path");
var fs = require("fs");
//var https = require('https');//Wolsecurity999 http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
var ursa = require('ursa');

var port = process.env.PORT || 3030;        // set our port
var mongoUrl = process.env.MONGO_HOST || 'localhost:27017';


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//db.users.save({ name: 'accessController' });
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://'+mongoUrl+'/WolUsers'); // connect to our database
db.then(() => {
  console.log('Connected correctly to server')
  db.get
  app.set('db',db);
  var login = require('./routes/login');
  var register = require('./routes/register');

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/login', login);
    app.use('/register', register);
})
//openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
//openssl req -nodes -new -x509 -keyout private.key -out server.cert
//openssl rsa -in private.key -outform PEM -pubout -out public.key
var publicKeyBuffer=fs.readFileSync('public.key');
var RSA = ursa.createPublicKey(publicKeyBuffer);
app.set('RSA-Public',RSA);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

process.on('SIGINT', function() {
  db.close(false,function(){
         process.exit(0);
  });
});

process.on('beforeExit', (opt) => {
    db.close();
});
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
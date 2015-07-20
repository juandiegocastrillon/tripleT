"use strict";

var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var engine = require('ejs-locals');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');

var opts = {
  // Specify the key file for the server
  key: fs.readFileSync('ssl/key.pem'),
   
  // Specify the certificate file
  cert: fs.readFileSync('ssl/cert.pem'),
   
  // Specify the Certificate Authority certificate
  ca: fs.readFileSync('ssl/ca/ca.crt'),
   
  // This is where the magic happens in Node.  All previous
  // steps simply setup SSL (except the CA).  By requesting
  // the client provide a certificate, we are essentially
  // authenticating the user.
  requestCert: true,
   
  // If specified as "true", no unauthenticated traffic
  // will make it to the route specified.
  rejectUnauthorized: true
};

var app = express();
https.createServer(opts, app).listen(process.env.PORT || 8888);

var dbpath = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'localhost';

var db = mongoose.connect(dbpath, function(err) {
    if (err) {
        console.log(err);
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// load models
require('./models/vote.js');
require('./models/election.js');
require('./models/diningWeek.js');

// auth middleware
require('./controllers/auth.js')(app);

// load routes
require('./routes/routes_auth.js')(app);
require('./routes/index.js')(app);
require('./routes/routes_voting.js')(app);
require('./routes/routes_dining.js')(app);

console.log("Server started");
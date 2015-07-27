"use strict";

var express = require('express');
// var session = require('client-sessions');
var session = require('express-session');
var mongoStore = require('connect-mongo')({
    session: session
});
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var engine = require('ejs-locals');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var passport = require('passport');

var app = express();

var dbpath = process.env.MONGOLAB_URI || 'localhost';
console.log(dbpath);
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
require('./models/user.js');
require('./models/vote.js');
require('./models/election.js');
require('./models/diningWeek.js');

require('./auth/passport.js')(passport);

// use Express MongoDB session storage
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'tripleT',
    store: new mongoStore({
        db: db.connection.db.s.databaseName,
        collection: 'sessions'
    })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// load routes
require('./routes/routes_users.js')(app);
require('./routes/index.js')(app);
require('./routes/routes_voting.js')(app);
require('./routes/routes_dining.js')(app);

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
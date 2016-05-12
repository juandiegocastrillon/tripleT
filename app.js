"use strict";
// import all necessary node modules
var express = require('express');
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
var favicon = require('serve-favicon');

var app = express();

// import the code that connects the database
require("./connectToDB.js");

// sets the "views" directory as the directory to hold all the html
// angular will load the template files in "views" to display all content
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon('./public/images/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// load all the models used by the back-end
require('./models/user.js');
require('./models/vote.js');
require('./models/election.js');
require('./models/diningWeek.js');
require('./models/pmRequest.js');

// Passport-js gives us better access to user authentication and authorization
require('./auth/passport.js')(passport);

// use Express MongoDB session storage
// A session storage allows a user to be loged in during an entire 
// session. This allows the user to not have to log-in every time
// he wants to access a new page.
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'tripleT',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// load routes
// Routes setup the API routes
require('./routes/routes_users.js')(app);
require('./routes/index.js')(app);
require('./routes/routes_election.js')(app);
require('./routes/routes_dining.js')(app);
require('./routes/routes_pm.js')(app);

app.listen(process.env.PORT || 5000);
console.log("Server Started");

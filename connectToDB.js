/**
 * Code to connect to the database
 */
var mongoose = require('mongoose');

var dbpath = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost';
var db = mongoose.connect(dbpath, function(err) {
    if (err) {
        console.log("Error connecting to " + dbpath);
        console.log(err);
    } else {
        console.log("Connected to DB");
    }
});
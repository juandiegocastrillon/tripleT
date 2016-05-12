/**
 * Load the index.ejs file into all the views
 */
module.exports = function(app) {
   app.route('/')
      .get(function(req, res) {
         res.render('index');
      });
}
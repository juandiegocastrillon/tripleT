var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
  voter: {
    type: String,
    required: true
  },
  vote: [{
    type: String,
    required: true
  }],
  
});

module.exports = mongoose.model('Vote', voteSchema);
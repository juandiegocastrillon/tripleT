var mongoose = require('mongoose');

var pmRequestSchema = mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('PmRequest', pmRequestSchema);

'use strict';

var mongoose = require('mongoose');

var pmRequestSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('PmRequest', pmRequestSchema);
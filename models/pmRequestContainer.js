var mongoose = require('mongoose');
var PmRequest = mongoose.model('PmRequest').schema;

var pmRequestContainerSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  requests: [PmRequest]
});

pmRequestContainerSchema.methods.addRequest = function(request) {
  this.requests.push(request);
  this.save();
}

module.exports = mongoose.model('PmRequestContainer', pmRequestContainerSchema);
